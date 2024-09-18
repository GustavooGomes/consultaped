async function lookupSku() {
    const skuId = document.getElementById('skuId').value;
    if (!skuId) {
        Swal.fire('ERRO', 'Por favor, preencha o ID do Produto', 'error');
        return;
    }

    try {
        const response = await fetch(`/sku/${skuId}`);
        const data = await response.json();
        if (response.ok) {
            Swal.fire({
                title: 'Informações do Produto:',
                html: `
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="${data.ImageUrl}" alt="Product Image" style="max-width: 250px;">
                    </div>
                                                <ul>
                                ${data.Stock.map(item => `
                                        <p><strong>Armazém:</strong> ${item.warehouseName}</p>
                                        <p><strong>Quantidade Total:</strong> ${item.totalQuantity}</p>
                                        <p><strong>Quantidade Reservada:</strong> ${item.reservedQuantity}</p>
                                        <p><strong>Quantidade disponível:</strong> ${item.totalQuantity - item.reservedQuantity}</p>
                                `).join('')}
                            </ul>
                    <div style="display: flex; justify-content: space-between; padding: 0 20px;">
                        <div style="flex: 1; padding-right: 20px;">
                            <h2>Principal</h2>
                            <p><strong>ID:</strong> ${data.Id}</p>
                            <p><strong>Nome:</strong> ${data.NameComplete}</p>
                            <p><strong>Descrição do Produto:</strong> ${data.ProductDescription}</p>
                        </div>
                        <div style="flex: 1; padding-left: 20px;">
                            <h2>Especificações</h2>
                            <p><strong>Referência:</strong> ${data.ProductRefId}</p>
                            <p><strong>Está ativo?:</strong> ${data.IsActive}</p>
                            <p><strong>Altura:</strong> ${data.Height} cm</p>
                            <p><strong>Largura:</strong> ${data.Width} cm</p>
                            <p><strong>Comprimento:</strong> ${data.Length} cm</p>
                            <p><strong>É Kit?:</strong> ${data.IsKit}</p>
                        </div>
                    </div>
                `,
                icon: 'info',
                width: '1200px'
            });
        } else {
            Swal.fire('Error', data.error, 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'Failed to fetch SKU data', 'error');
    }
}
