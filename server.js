require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');
const PORT = 3000;

app.use(express.static('public'));

app.get('/sku/:id', async (req, res) => {
    const skuId = req.params.id;
    try {
        console.log(`Fetching SKU data for ID: ${skuId}`);
        
        // Chamada para obter os dados do SKU
        const skuResponse = await axios({
            method: 'GET',
            url: `https://altenburghomolog.vtexcommercestable.com.br/api/catalog_system/pvt/sku/stockkeepingunitbyid/${skuId}`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-VTEX-API-AppKey': process.env.VTEX_API_APP_KEY,
                'X-VTEX-API-AppToken': process.env.VTEX_API_APP_TOKEN
            }
        });

        console.log('SKU data fetched successfully:', skuResponse.data);

        // Chamada para obter os dados de estoque
        const stockResponse = await axios({
            method: 'GET',
            url: `https://altenburghomolog.vtexcommercestable.com.br/api/logistics/pvt/inventory/skus/${skuId}`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-VTEX-API-AppKey': process.env.VTEX_API_APP_KEY,
                'X-VTEX-API-AppToken': process.env.VTEX_API_APP_TOKEN
            }
        });

        console.log('Stock data fetched successfully:', stockResponse.data);

        const skuData = skuResponse.data;
        const stockData = stockResponse.data;

        const filteredData = {
            Id: skuData.Id,
            NameComplete: skuData.NameComplete,
            ProductDescription: skuData.ProductDescription,
            ProductRefId: skuData.ProductRefId,
            IsActive: skuData.IsActive,
            ImageUrl: `https://altenburg-images.s3.sa-east-1.amazonaws.com/FOTOS_SITE/${skuData.ProductRefId}-1.jpg`,
            Height: skuData.Dimension.height,
            Width: skuData.Dimension.width,
            Length: skuData.Dimension.length,
            IsKit: skuData.IsKit,
            Stock: stockData.balance.map(item => ({
                warehouseId: item.warehouseId,
                warehouseName: item.warehouseName,
                totalQuantity: item.totalQuantity,
                reservedQuantity: item.reservedQuantity,
                hasUnlimitedQuantity: item.hasUnlimitedQuantity,
                timeToRefill: item.timeToRefill,
                dateOfSupplyUtc: item.dateOfSupplyUtc,
                leadTime: item.leadTime
            }))
        };

        res.json(filteredData);
    } catch (error) {
        console.error('Error fetching SKU or stock data:', error.response ? error.response.data : error.message);
        res.status(500).json({ 
            error: 'Failed to fetch SKU or stock data',
            details: error.response ? error.response.data : error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
