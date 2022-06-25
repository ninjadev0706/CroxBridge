import { useEffect, useState, useCallback } from 'react'
import axios from 'axios';

/*
 * Due to Cors the api was forked and a proxy was created
 * @see https://github.com/pancakeswap/gatsby-pancake-api/commit/e811b67a43ccc41edd4a0fa1ee704b2f510aa0ba
 */
export const baseUrl = 'https://api.pancakeswap.com/api/v1'

/* eslint-disable camelcase */

export interface TradePair {
  swap_pair_contract: string
  base_symbol: string
  quote_symbol: string
  last_price: number
  base_volume_24_h: number
  quote_volume_24_h: number
}

export interface ApiStatResponse {
  update_at: string
  '24h_total_volume': number
  total_value_locked: number
  total_value_locked_all: number
  trade_pairs: {
    [key: string]: TradePair
  }
}

export const useGetStats = () => {
  const [data, setData] = useState<ApiStatResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/stat`)
        const responsedata: ApiStatResponse = await response.json()

        setData(responsedata)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [setData])

  return data
}

export const useGetTxData = () => {

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get("http://localhost:8080/api/")
          .then((res) => {
            setData(res);
          })
          .catch((err) => {
            console.log(err)
          })
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [])
  return data;
}

// export const useAnyRouterTokens = () => {

//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         await axios.get("https://bridgeapi.anyswap.exchange/v2/serverInfo/")
//           .then((res) => {
//             console.log("res => ", res);
//             setData(res);
//           })
//           .catch((err) => {
//             console.log(err)
//           })
//       } catch (error) {
//         console.error('Unable to fetch data:', error)
//       }
//     }

//     fetchData()
//   }, [])
//   return data;
// }

export const useRouterData = () => {
  const [anyRouterInfo, setData] = useState(null);
  const handleRouter = useCallback(async (chainId, tokenAddress) => {
    const fetchData = async () => {
      const tokenAddr = tokenAddress.toLowerCase();
      try {
        await axios.get(`https://bridgeapi.anyswap.exchange/v3/serverinfoV3?chainId=all`)
          .then((res) => {
            const datas = Object.values(res.data);
            datas.map(data => {
              if(data[chainId][tokenAddr]) {
                setData(data[chainId][tokenAddr]);
              }
              return data[chainId][tokenAddr];
            })
          })
          .catch((err) => {
            console.log(err)
          })
          return;
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    if(chainId && tokenAddress) {
      fetchData()
    }
  }, []);

  return { onRouterData: handleRouter, anyRouterInfo };
};

export const useAnyBridgeData = () => {
  const [anyChaindata, setData] = useState(null);
  const handleApprove = useCallback(async (chainId) => {
    const fetchData = async () => {
      try {
        await axios.get(`https://bridgeapi.anyswap.exchange/v2/serverInfo/${chainId}`)
          .then((res) => {
            setData(res);
          })
          .catch((err) => {
            console.log(err)
          })
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, []);

  return { onBridgeData: handleApprove, anyChaindata };
};

export const useTxStatus = () => {
  const [txStatus, setTxStatus] = useState(null);
  const handleApprove = useCallback(async (txId) => {
    const fetchData = async () => {
      try {
        await axios.get(`https://bridgeapi.anyswap.exchange/v2/history/details?params=${txId}`)
          .then((res) => {
            setTxStatus(res.data.msg);
          })
          .catch((err) => {
            console.log(err)
          })
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, []);

  return { onTxStatus: handleApprove, txStatus };
};


