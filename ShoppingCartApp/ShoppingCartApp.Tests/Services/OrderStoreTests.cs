using System;
using ShoppingCartApp.Models;
using ShoppingCartApp.Services;
using Xunit;

namespace ShoppingCartApp.Tests.Services;

public class OrderStoreTests
{
    public OrderStoreTests()
    {
        OrderStore.Clear();
    }

    [Fact]
    public void Orders_AddingOrder_ShouldStoreOrder()
    {
        // Arrange
        var key = Guid.NewGuid();
        var order = new Order();

        // Act
        OrderStore.Orders[key] = order;

        // Assert
        Assert.Single(OrderStore.Orders);
        Assert.True(OrderStore.Orders.ContainsKey(key));
        Assert.Same(order, OrderStore.Orders[key]);
    }

    [Fact]
    public void Orders_ShouldBeEmpty_WhenNoOrdersAdded()
    {
        Assert.Empty(OrderStore.Orders);
    }
}
