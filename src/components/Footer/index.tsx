/* eslint-disable */
import React, { useState, useCallback } from "react";
import { useWeb3React } from '@web3-react/core'
import { useHistory } from "react-router-dom";
import BigNumber from "bignumber.js/bignumber";
import useTheme from "hooks/useTheme";
import { getBalanceNumber } from "utils/formatBalance";
import { usePriceCakeBusd } from "state/hooks";
import {
  Link,
  Text,
  Flex,
  Button,
  useWalletModal,
  useMatchBreakpoints,
  ConnectorId,
} from "crox-new-uikit";
import {
  useTotalSupply,
  useBurnedBalance,
} from "hooks/useTokenBalance";
import CardValue from "./CardValue";
import { getCakeAddress } from "../../utils/addressHelpers";
import { Swiper, SwiperSlide } from "swiper/react";
import useMediaQuery from "@mui/material/useMediaQuery";
import SwiperCore, { EffectCoverflow, EffectCube, Autoplay } from "swiper/core";
import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { injected, bsc } from "../../utils/connector";
import Config from './partnerConfig';
import "./menu.styles.css";
import "swiper/swiper.min.css";
import "swiper/components/effect-cube/effect-cube.min.css"
import "swiper/components/effect-coverflow/effect-coverflow.min.css"
SwiperCore.use([EffectCoverflow, EffectCube, Autoplay]);

const Footer = (props) => {
  const history = useHistory();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { account, activate, deactivate } = useWeb3React();
  const handleLogin = (connectorId: ConnectorId) => {
    // if (connectorId === "walletconnect") {
    //   return activate(walletconnect);
    // }
    if (connectorId === "bsc") {
      return activate(bsc);
    }
    return activate(injected);
  };
  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  const { isMd, isSm, isXs, isLg } = useMatchBreakpoints();

  const [isChecked, setIsChecked] = useState(false);

  const toggle = () => setIsChecked(!isChecked);
  const { isDark, toggleTheme } = useTheme();

  const cakePriceUsd = usePriceCakeBusd();
  const totalSupply = useTotalSupply();
  const burnedBalance = useBurnedBalance(getCakeAddress());
  const circSupply = totalSupply
    ? totalSupply.minus(burnedBalance)
    : new BigNumber(0);
  const marketCap = cakePriceUsd.times(circSupply);

  const token = getCakeAddress();
  const SwitchClick = (data) => {
    toggleTheme()
  }
  const addWatchToken = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const provider = window.ethereum;
    if (provider) {
      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await provider.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: token,
              symbol: "CROX",
              decimals: "18",
              image: "https://app.croxswap.com/images/egg/logo.png",
            },
          },
        });

        if (wasAdded) {
          // eslint-disable-next-line
          console.log("Token was added");
        }
      } catch (error) {
        // TODO: find a way to handle when the user rejects transaction or it fails
      }
    }
  }, [token]);
  const [expanded, setExpanded] = React.useState('');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : '');
  };

  return (
    <>
      <div className="partners">
        <Text className="footer_headtext" fontSize="50px" color="white" bold>Partner Reviews</Text>
        <div className="partner_review_group">
          <Swiper
            effect={'coverflow'}
            centeredSlides={true}
            navigation={false}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 20,
              stretch: -40,
              depth: 280,
              modifier: 1.3,
              slideShadows: true,
            }}
            className="swiper_head"
            breakpoints={{
              1400: {
                slidesPerView: 3.3,
                spaceBetween: 20,
              },
              1060: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              600: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              200: {
                slidesPerView: 1,
                spaceBetween: 0,
              },
            }}
          >
            <SwiperSlide>
              <div className={!isDark ? "partner_review_white" : "partner_review"}>
                <div style={{ height: '40px' }}>
                  <img src="/images/footer/centric.png" width="130px" alt="" />
                </div>
                <Text color="white" ml="25px">The Centric community has enjoyed the various staking options on CroxSwap. The Dual-Farms are especially cool, as every deposit to the CNS-BNB LP adds CNS liquidity on PancakeSwap. Plus, the CroxSwap team has been wonderful to work with!</Text>
                <Text fontSize="14px" color="aqua" style={{ textAlign: 'right' }}>--Thomas Butcher, COO, CentricSwap</Text>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className={!isDark ? "partner_review_white" : "partner_review"}>
                <div style={{ height: '40px' }}>
                  <img src="/images/footer/rasta.png" width="130px" alt="" />
                </div>
                <Text color="white" fontSize="19px" ml="25px">Throughout the toughest challenges, it is the company you keep that defines your success. We are honored to have CroxSwap as our main partners on this exciting journey to the moon.</Text>
                <Text fontSize="14px" color="aqua" style={{ textAlign: 'right' }}>-- Senor Burdy, Founder & CEO, Rasta Finance</Text>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className={!isDark ? "partner_review_white" : "partner_review"}>
                <div style={{ height: '40px' }}>
                  <img src="/images/footer/crush.png" width="130px" alt="" />
                </div>
                <Text color="white" fontSize="19px" ml="25px">Croxswap is by far one of our favorite partner projects. Cool team, good tech, what’s not to love? They’re definitely one to keep an eye on, and can’t wait to see what we collaborate on in the future.</Text>
                <Text fontSize="14px" color="aqua" style={{ textAlign: 'right' }}>-- Master Blaster, Bitcrush Arcade</Text>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <Text fontSize="50px" className="footer_headtext" bold mt="70px" mb="20px" style={{ textAlign: 'center' }} color="white">Partners</Text>
        <div className="partners_group">
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ alignItems: 'center' }}>
            {Config.map((entry, index) => (
              <Grid className='partner_img' key={index} item xs={6} sm={4} md={3} lg={2}>
                <Link external href={entry.iconlink}><img src={`/images/footer/${entry.label}.png`} alt="" /></Link>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
      <div className="footer">
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} md={12} lg={2.2}>
            <div className="social_icon">
              <Text fontSize="32px" style={{ textAlign: 'center' }} bold color="white">Socials</Text>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 20,
                  justifyContent: 'space-between'
                }}
              >
                <Grid container>
                  <Grid item style={{ textAlign: 'center' }} xs={2} sm={4} md={2}>
                    <a href="https://t.me/croxswap">
                      <img
                        src="/icon_telegram.svg"
                        alt="telegram"
                      />
                    </a>
                  </Grid>
                  <Grid item style={{ textAlign: 'center' }} xs={2} sm={4} md={2}>
                    <a href="https://twitter.com/croxswap">
                      <img
                        src="/icon_twitter.svg"
                        alt="twitter"
                      />
                    </a>
                  </Grid>
                  <Grid item style={{ textAlign: 'center' }} xs={2} sm={4} md={2}>
                    <a href="https://github.com/croxswap">
                      <img
                        src="/icon_github.svg"
                        alt="github"
                      />
                    </a>
                  </Grid>
                  <Grid item style={{ textAlign: 'center' }} xs={2} sm={4} md={2}>
                    <a href="https://www.youtube.com/channel/UCPEJ2aiaH03VwKe4YoFWSGw">
                      <img
                        src="/icon_youtube.svg"
                        alt="youtube"
                      />
                    </a>
                  </Grid>
                  <Grid item style={{ textAlign: 'center' }} xs={2} sm={4} md={2}>
                    <a href="https://croxswap.medium.com">
                      <img
                        src="/icon_medium.svg"
                        alt="blog"
                      />
                    </a>
                  </Grid>
                  <Grid item style={{ textAlign: 'center' }} xs={2} sm={4} md={2}>
                    <a href="https://reddit.com/r/croxswap">
                      <img
                        src="/icon_reddit.svg"
                        alt="reddit"
                      />
                    </a>
                  </Grid>
                </Grid>
              </div>
            </div>
            <Flex justifyContent="center" alignItems='center'>
              <a className="text" href="mailto: support@croxswap.com">Contact <img src="images/mobilelogo.png" alt="logo" style={{ width: "30px", marginLeft: '3px' }} /> Us</a>
            </Flex>
          </Grid>
          <Grid item xs={12} lg={6}>
            <div className="several_links">
              <div>
                <Text color="white" fontSize="20px" bold>About</Text>
                <Link style={{ lineHeight: '2.5' }} external href="https://docs.croxswap.com">Docs</Link>
                <Link style={{ lineHeight: '2.5' }} external href="https://github.com/croxswap">Github</Link>
                <Link style={{ lineHeight: '2.5' }} external href="https://croxswap.medium.com/">Blog</Link>
                <Link style={{ lineHeight: '2.5' }} external href="https://github.com/croxswap/audits">Audits</Link>
                <Link style={{ lineHeight: '2.5' }} external href="https://docs.croxswap.com/guide">Guide</Link>
              </div>
              <div>
                <Text color="white" fontSize="20px" bold>Charts</Text>
                <Link style={{ lineHeight: '2.5' }} external href="https://dex.guru/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491-bsc">DexGuru</Link>
                <Link style={{ lineHeight: '2.5' }} external href="https://poocoin.app/tokens/0x2c094f5a7d1146bb93850f629501eb749f6ed491">Poocoin</Link>
                <Link style={{ lineHeight: '2.5' }} external href="https://charts.bogged.finance/?token=0x2c094F5A7D1146BB93850f629501eB749f6Ed491">BoggedCharts</Link>
                <Link style={{ lineHeight: '2.5' }} external href="https://www.dextools.io/app/bsc/pair-explorer/0xe38e899cc99ddea9737e06f0a22046d0ca904d70">Dextools</Link>
              </div>
              <div>
                <Text color="white" fontSize="20px" bold>Listings</Text>
                <Link style={{ lineHeight: '2.5' }} external href="https://coinmarketcap.com/currencies/croxswap/">CoinMarketCap</Link>
                <Link style={{ lineHeight: '2.5' }} external href="https://www.coingecko.com/en/coins/croxswap">Coingecko</Link>
                <Link style={{ lineHeight: '2.5' }} external href="https://pancakeswap.info/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491">Pancakeswap</Link>
                <Link style={{ lineHeight: '2.5' }} external href="https://bscscan.com/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491">Bscscan</Link>
                <Link style={{ lineHeight: '2.5' }} external href="https://babyswap.info/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491">Babyswap</Link>
              </div>
              <div>
                <Text color="white" fontSize="20px" bold>Products</Text>
                <Link style={{ lineHeight: '2.5' }} href="https://exchange.croxswap.com/#/swap">Exchange</Link>
                <Link style={{ lineHeight: '2.5' }} href="https://exchange.croxswap.com/#/pool">Liquidity</Link>
                <Link style={{ lineHeight: '2.5' }}>Launchpad(soon)</Link>
                <Link style={{ lineHeight: '2.5' }} external href="https://referral.croxswap.com">Referral Program</Link>
                <Link style={{ lineHeight: '2.5' }} external href="https://forms.gle/xv759uRs4GARh4jQA">Appy for Pools</Link>
              </div>
              <div>
                <Text color="white" fontSize="20px" bold>Innovation</Text>
                <Link style={{ lineHeight: '2.5' }} onClick={() => history.push("/farms")}>Dual-Farms</Link>
                <Link style={{ lineHeight: '2.5' }} onClick={() => history.push("/pools/crox")}>Next-Gen Pools</Link>
                <Link style={{ lineHeight: '2.5' }} href="https://bridge.croxswap.com">Cross-chain Bridge(Soon)</Link>
              </div>
            </div>
            {isMobile && (
              <div>
                <Accordion expanded={expanded === "panel1" ? true : false} onChange={handleChange('panel1')} className="accordion_top">
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    <Typography sx={{ width: '100%', flexShrink: 0, fontSize: 14, color: 'white' }}>
                      About
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className="accordion_detail">
                    <Link style={{ lineHeight: '2' }} external href="https://docs.croxswap.com">Docs</Link>
                    <Link style={{ lineHeight: '2' }} external href="https://github.com/croxswap">Github</Link>
                    <Link style={{ lineHeight: '2' }} external href="https://croxswap.medium.com/">Blog</Link>
                    <Link style={{ lineHeight: '2' }} external href="https://github.com/croxswap/audits">Audits</Link>
                    <Link style={{ lineHeight: '2' }} external href="https://docs.croxswap.com/guide">Guide</Link>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === "panel2" ? true : false} onChange={handleChange('panel2')} className="accordion_top">
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                  >
                    <Typography sx={{ width: '100%', flexShrink: 0, fontSize: 14, color: 'white' }}>Charts</Typography>
                  </AccordionSummary>
                  <AccordionDetails className="accordion_detail">
                    <Link style={{ lineHeight: '2' }} external href="https://dex.guru/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491-bsc">DexGuru</Link>
                    <Link style={{ lineHeight: '2' }} external href="https://poocoin.app/tokens/0x2c094f5a7d1146bb93850f629501eb749f6ed491">Poocoin</Link>
                    <Link style={{ lineHeight: '2' }} external href="https://charts.bogged.finance/?token=0x2c094F5A7D1146BB93850f629501eB749f6Ed491">BoggedCharts</Link>
                    <Link style={{ lineHeight: '2' }} external href="https://www.dextools.io/app/bsc/pair-explorer/0xe38e899cc99ddea9737e06f0a22046d0ca904d70">Dextools</Link>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === "panel3" ? true : false} onChange={handleChange('panel3')} className="accordion_top">
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                    aria-controls="panel3bh-content"
                    id="panel3bh-header"
                  >
                    <Typography sx={{ width: '100%', flexShrink: 0, fontSize: 14, color: 'white' }}>
                      Listings
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className="accordion_detail">
                    <Link style={{ lineHeight: '2' }} external href="https://coinmarketcap.com/currencies/croxswap/">CoinMarketCap</Link>
                    <Link style={{ lineHeight: '2' }} external href="https://www.coingecko.com/en/coins/croxswap">Coingecko</Link>
                    <Link style={{ lineHeight: '2' }} external href="https://pancakeswap.info/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491">Pancakeswap</Link>
                    <Link style={{ lineHeight: '2' }} external href="https://bscscan.com/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491">Bscscan</Link>
                    <Link style={{ lineHeight: '2' }} external href="https://babyswap.info/token/0x2c094f5a7d1146bb93850f629501eb749f6ed491">Babyswap</Link>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === "panel4" ? true : false} onChange={handleChange('panel4')} className="accordion_top">
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                    aria-controls="panel4bh-content"
                    id="panel4bh-header"
                  >
                    <Typography sx={{ width: '100%', flexShrink: 0, fontSize: 14, color: 'white' }}>Products</Typography>
                  </AccordionSummary>
                  <AccordionDetails className="accordion_detail">
                    <Link style={{ lineHeight: '2' }} href="https://exchange.croxswap.com/#/swap">Exchange</Link>
                    <Link style={{ lineHeight: '2' }} href="https://exchange.croxswap.com/#/pool">Liquidity</Link>
                    <Link style={{ lineHeight: '2' }}>Launchpad(soon)</Link>
                    <Link style={{ lineHeight: '2' }} external href="https://referral.croxswap.com">Referral Program</Link>
                    <Link style={{ lineHeight: '2' }} external href="https://forms.gle/xv759uRs4GARh4jQA">Appy for Pools</Link>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === "panel5" ? true : false} onChange={handleChange('panel5')} className="accordion_top">
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                    aria-controls="panel5bh-content"
                    id="panel5bh-header"
                  >
                    <Typography sx={{ width: '100%', flexShrink: 0, fontSize: 14, color: 'white' }}>Innovation</Typography>
                  </AccordionSummary>
                  <AccordionDetails className="accordion_detail">
                    <Link style={{ lineHeight: '2' }} onClick={() => history.push("/farms")}>Dual-Farms</Link>
                    <Link style={{ lineHeight: '2' }} onClick={() => history.push("/pools/crox")}>Next-Gen Pools</Link>
                    <Link style={{ lineHeight: '2' }} href="https://bridge.croxswap.com">Cross-chain Bridge(Soon)</Link>
                  </AccordionDetails>
                </Accordion>
              </div>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={3.8}>
            <div className="crox_detail">
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ margin: "2% 0 2% -10px" }}>
                <Grid item xs={12} sm={4}>
                  <Flex flexDirection={!isMobile ? "column" : "row"} justifyContent="space-between">
                    <Flex alignItems="center">
                      <img src="/footer_logo.svg" alt="logo" style={{ width: "50px" }} />
                      <Text color="white" ml="5px" fontSize="20px" bold>${cakePriceUsd.toFixed(2)}</Text>
                    </Flex>
                    <Flex alignItems='center' mt='10px'>
                      <Button style={{ width: "50px", height: '50px', borderRadius: '50%', background: "#121827 url('./Metamask.svg') no-repeat center", backgroundSize: "30px" }} onClick={addWatchToken}>
                      </Button>
                      <span
                        style={{
                          fontSize: "8px",
                          color: "white",
                          marginLeft: "5px",
                          cursor: "pointer",
                        }}
                      >
                        <Button mt='8px' className='buycrox_btn' style={{ height: '30px', borderRadius: '5px', padding: '5px', margin: "0" }}>
                          <Link href="https://exchange.croxswap.com/#/swap"><p style={{ fontSize: "12px" }}>BUY CROX</p></Link>
                        </Button>
                      </span>
                    </Flex>
                    {!isMobile && (<div style={{ marginTop: '20px', marginLeft: '0px' }} className={isDark ? 'tdnn' : 'tdnn day'} onClick={(e) => SwitchClick(e)}>
                      <div className={isDark ? 'moon' : 'moon sun'} />
                    </div>)}
                  </Flex>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <div className="crox_info">
                    <Flex>
                      <Text className="detail_info">MAX SUPPLY:</Text>
                      <Text color="white" bold>5,000,000</Text>
                    </Flex>
                    <Flex>
                      <Text className="detail_info">CIRCULATING SUPPLY:</Text>
                      <Text>
                        <CardValue
                          fontSize="16px"
                          value={getBalanceNumber(circSupply)}
                          decimals={0}
                        />
                      </Text>
                    </Flex>
                    <Flex>
                      <Text className="detail_info">TOTAL BURNED:</Text>
                      <Text>
                        <CardValue
                          fontSize="16px"
                          value={getBalanceNumber(burnedBalance)}
                          decimals={0}
                        />
                      </Text>
                    </Flex>
                    <Flex>
                      <Text className="detail_info">MARKET CAP:</Text>
                      <Text>
                        <CardValue
                          fontSize="16px"
                          value={getBalanceNumber(marketCap)}
                          decimals={0}
                          prefix="$"
                        />
                      </Text>
                    </Flex>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Footer;
