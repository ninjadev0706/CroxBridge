export interface Config {
    title: string;
    chainID: number;
    img: string;
}
const networkList: Config[] = [
{
    title: "BNB Chain",
    chainID: 56,
    img: "bsc",
},
{
    title: "Polygon",
    chainID: 137,
    img: "polygon",
},
{
    title: "Ethereum",
    chainID: 1,
    img: 'ethereum',
},
{
    title: "Fantom Opera",
    chainID: 250,
    img: 'fantom',
},
{
    title: "Rinkeby",
    chainID: 4,
    img: 'ethereum',
},
{
    title: "Goerli",
    chainID: 5,
    img: 'ethereum',
},
]
  
export default networkList;