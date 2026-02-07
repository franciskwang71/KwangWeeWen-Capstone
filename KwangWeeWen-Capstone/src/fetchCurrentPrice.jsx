const API_KEY = "vlfbSE5J4thppQmsmI1xppH0bXhAYSqE"; 

export const fetchCurrentPrice = async (symbol) => { 
    try { 
        const response = await fetch( 
            `https://api.massive.com/v2/aggs/ticker/${symbol}/range/1/day/2026-01-05/2026-01-05?adjusted=true&sort=asc&limit=1&apiKey=${API_KEY}`
        ); 
        if (!response.ok) { 
            console.error("Invalid response from Massive API"); 
            return null; 
        } 
        const data = await response.json();
        return data.results["c"] ?? null; 
    } catch (err) { 
        console.error("Price fetch error:", err); 
        return null; 
    } 
};