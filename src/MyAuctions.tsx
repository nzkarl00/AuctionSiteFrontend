import Navbar from "./Navbar";
import React from "react";
import {
    Avatar,
    Box,
    Container,
    Divider,
    Grid, List,
    ListItemButton,
    ListItemText,
    Paper,
    Stack,
    Tab,
    Tabs,
    Typography
} from "@mui/material";
import axios from "axios";
import {useUserStore} from "./store";
import {inspect} from "util";

const MyAuctions = () => {
    // @ts-ignore
    const [auctions, setAuctions] = React.useState<Array<auction>>([])
    const [buyingAuctions, setBuyingAuctions] = React.useState<Array<auction>>([])
    const [tab, setTab] = React.useState(0);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [sellingAuctions, setSellingAuctions] = React.useState<Array<auction>>([])
    const userId = useUserStore(state => state.userId)
    const millisInDay = 86400000;
    interface TabPanelProps {children?: React.ReactNode; index: number; value: number;}
    React.useEffect(() => {
        getSelling()
    }, [])
    const getSelling = () => {
        axios.get('http://localhost:4941/api/v1/auctions')
            .then(async (response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setAuctions(response.data.auctions)
                setSellingAuctions(response.data.auctions.filter((a: auction) => a.sellerId === userId))
                let buying = await getBids(response.data.auctions)
                console.log(buying)
                setBuyingAuctions((response.data.auctions.filter((a: auction) => buying.includes(a.auctionId))))
                console.log(buyingAuctions)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    async function getBids(aucs: Array<auction>) {
        let buying: number[] = []
        await Promise.all(aucs.map(a => axios.get('http://localhost:4941/api/v1/auctions/' + a.auctionId + '/bids')
            .then(bidsResponse => {
                if (bidsResponse.data.map((b: bid) => b.bidderId).includes(userId)) {
                    buying.push(a.auctionId)
                }
            })));
        console.log(buying)
        return buying
    }
    const styles = {
        auctionPhoto: {
            height: 120,
            width: 240,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        auctionItem: {
            borderColor: 'black'
        },
        center: {
            display: 'flex',
            alignItems: 'center',
        },
        reserveNotMet: {
            color: 'gray'
        },
        reserveMet: {
            color: 'orange'
        },
        reserveSold: {
            color: 'green'
        }
    }
    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tab"
                hidden={value !== index}
                id={`tabPanel${index}`}
                aria-labelledby={`tabPanel${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        {children}
                    </Box>
                )}
            </div>
        );
    }
    const timeRemaining = (a: auction) => {
        let endDate = new Date(a.endDate);
        let delta = endDate.getTime() - Date.now();
        if (delta < 0) {
            return <p style={styles.reserveNotMet}>Closed</p>
        } else if (delta < millisInDay) {
            return <p>Closing today!</p>
        } else {
            return <p>Closing in {Math.floor(delta/millisInDay)} days</p>
        }
    }
    const auctionReserve = (a: auction) => {
        if (!a.highestBid) {
            if ((new Date(a.endDate)).getTime() > Date.now()) {
                return <p style={styles.reserveNotMet}>No bids</p>
            } else {
                return <p style={styles.reserveNotMet}>Closed: Unsold</p>
            }
        } else {
            if ((new Date(a.endDate)).getTime() < Date.now()) {
                if (a.highestBid >= a.reserve) {
                    return <p style={styles.reserveSold}>Sold For: ${a.highestBid}</p>
                } else {
                    return <p style={styles.reserveNotMet}>Closed: Unsold</p>

                }
            } else {
                if (a.reserve > a.highestBid) {
                    return (
                        <p style={styles.reserveNotMet}>Current Bid: ${a.highestBid}</p>
                    )
                } else {
                    return (
                        <p style={styles.reserveMet}>Current bid: ${a.highestBid}</p>
                    )
                }
            }
        }
    }

    const changeTab = (event: React.SyntheticEvent, tab: number) => {
        setTab(tab);
    };

    const auctionList = (l: Array<auction>) => {
        return l.map(a =>
            <Paper elevation={3}>
                <ListItemButton key={a.auctionId} component="a"
                                href={'/auctions/' + a.auctionId} style={styles.auctionItem}>
                    <Grid container spacing={1}>
                        <Grid item sm={2} style={styles.auctionPhoto}>
                            <img alt={a.title + ' auction image'} src={'http://localhost:4941/api/v1/auctions/' + a.auctionId + '/image'}
                                 onError={({ currentTarget }) => {
                                     currentTarget.onerror = null; // prevents looping
                                     currentTarget.src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Missing-image-232x150.png";
                                 }} height={120}/>
                        </Grid>
                        <Grid item sm={5.5}>
                            <ListItemText>
                                <h3>{a.title}</h3>
                                {timeRemaining(a)}
                            </ListItemText>
                        </Grid>
                        <Grid item sm={2}>
                            <Stack>
                                <ListItemText>{auctionReserve(a)}</ListItemText>
                                <ListItemText>Reserve: ${a.reserve}</ListItemText>
                            </Stack>

                        </Grid>
                        <Grid item sm={1.8} style={styles.center} sx={{justifyContent: 'center'}}>
                            {a.sellerFirstName} {a.sellerLastName}
                        </Grid>
                        <Grid item sm={0.7} style={styles.center}>
                            <Avatar sx={{height: 50, width: 50}} alt={a.sellerFirstName + " " + a.sellerLastName} src={"http://localhost:4941/api/v1/users/" + a.sellerId + "/image"}/>
                        </Grid>
                    </Grid>
                </ListItemButton><Divider/>
            </Paper>
        )
    }
    return (
        <div>
            <h1>My Auctions</h1>
            <Navbar pageName={"My Auctions"}/>
            <Container maxWidth="md">
                <Paper elevation={4}>
                    <br></br>
                    <Typography align={"center"} variant={"h4"}>My Auctions</Typography>
                    <br></br>
                    <Divider />
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs onChange={changeTab} value={tab} aria-label="myAuctionsTab">
                            <Tab style={{width: "25%"}} label="All"/>
                            <Tab style={{width: "25%"}} label="Buying"/>
                            <Tab style={{width: "25%"}} label="Selling"/>
                        </Tabs>
                    </Box>
                    <TabPanel value={tab} index={0}>
                        <List>{auctionList(buyingAuctions.concat(sellingAuctions))}</List>
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        <List>{auctionList(buyingAuctions)}</List>
                    </TabPanel>
                    <TabPanel value={tab} index={2}>
                        <List>{auctionList(sellingAuctions)}</List>
                    </TabPanel>
                </Paper>
            </Container>
        </div>
    )
}
export default MyAuctions