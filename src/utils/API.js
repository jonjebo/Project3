import axios from "axios";



export default {
    // makes a call to the stocks API using a list of company symbols
    getData: function(symbArr) {
        // types: what information to retreive
        const types  = "types=chart,logo";
        // range: how far back we want the charts to go
        const range  = "range=1d";
        // symbols: list of companies to search
        let symbols = "symbols=";
        for(let i=0;i<symbArr.length;i++){
            let symbol = symbArr[i];
            if (i !== (symbArr.length - 1)){
                symbol += ","
            }
            symbols += symbol;
        }
        return axios.get(
            "https://api.iextrading.com/1.0/stock/market/batch?" + 
            symbols+"&"+types+"&"+range
        );
    },
    // make a call to the stocks API to get company info
    //   suing its symbol (will throw error if symbol invalid)
    searchSymbol: function(symbol){
        return axios.get(
            "https://api.iextrading.com/1.0/stock/"+symbol+"/company"
        );

    }
};
