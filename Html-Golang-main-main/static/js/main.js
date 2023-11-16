var orderList = [];
    var totalAmount = 0;

    function addToOrder(foodName, price) {
        orderList.push({ name: foodName, price: price });
        totalAmount += price;
        
        fetch('/add-to-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: foodName,
                price: price,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add item to order');
            }
            // Refresh order details after adding an item
            updateOrderDetails();
        })
        .catch(error => {
            console.error('Error:', error);
        });
        // Update the order details on the page
  
    }

    function updateOrderDetails() {
        var orderListElement = document.getElementById('orderList');
        var totalAmountElement = document.getElementById('totalAmount');

        // Clear previous content
        orderListElement.innerHTML = '';
        
        fetch('/order-details')
        .then(response => response.json())
        .then(order => {
        // Populate the order list
        orderList.forEach(function (item) {
            var listItem = document.createElement('li');
            listItem.textContent = item.name + ' - $' + item.price.toFixed(2);
            orderListElement.appendChild(listItem);
        });

        // Update the total amount
        totalAmountElement.textContent = totalAmount.toFixed(2);

        })
        .catch(error => {
            console.error('Error:', error);
        });

    }

    function placeOrder() {
        // Send an HTTP POST request to the /place-order endpoint
        fetch('/place-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderList),
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        alert('Order placed! Total amount: $' + totalAmount.toFixed(2));
        
        // Reset order details after placing the order
        orderList = [];
        totalAmount = 0;
        updateOrderDetails();
        
    }
    