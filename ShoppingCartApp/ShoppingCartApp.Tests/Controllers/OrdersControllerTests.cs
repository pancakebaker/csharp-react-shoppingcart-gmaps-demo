using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ShoppingCartApp.Controllers;
using ShoppingCartApp.Dtos;
using ShoppingCartApp.Models;
using ShoppingCartApp.Services;
using Xunit;

namespace ShoppingCartApp.Tests.Controllers;

public class OrdersControllerTests
{
    public OrdersControllerTests()
    {
        // Reset static store before each test
        OrderStore.Orders.Clear();
    }

    [Fact]
    public void Create_WhenValidRequest_ShouldReturnCreated()
    {
        // Arrange
        var controller = new OrdersController();
        var product = ProductService.Products.First();

        var request = new CreateOrderRequest
        {
            Customer = new CustomerDto
            {
                Name = "Pancake Baker",
                Email = "test.user@demo.app",
                Phone = "09123456789",
                Address = "Manila"
            },
            Location = new LocationDto
            {
                Lat = 14.5995,
                Lng = 120.9842
            },
            Items =
            [
                new OrderItemDto
                {
                    ProductId = product.Id,
                    Qty = 2
                }
            ]
        };

        // Act
        var result = controller.Create(request);

        // Assert
        Assert.IsType<CreatedAtActionResult>(result);
        Assert.Single(OrderStore.Orders);
    }

    [Fact]
    public void Create_WhenItemsEmpty_ShouldReturnBadRequest()
    {
        // Arrange
        var controller = new OrdersController();

        var request = new CreateOrderRequest
        {
            Customer = new CustomerDto
            {
                Name = "Pancake Baker",
                Email = "test.user@demo.app",
                Phone = "0912",
                Address = "Manila"
            },
            Items = []
        };

        // Act
        var result = controller.Create(request);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public void Create_WhenInvalidProductId_ShouldReturnBadRequest()
    {
        // Arrange
        var controller = new OrdersController();

        var request = new CreateOrderRequest
        {
            Customer = new CustomerDto
            {
                Name = "Pancake Baker",
                Email = "test.user@demo.app",
                Phone = "0912",
                Address = "Manila"
            },
            Location = new LocationDto { Lat = 0, Lng = 0 },
            Items =
            [
                new OrderItemDto
                {
                    ProductId = 999,
                    Qty = 1
                }
            ]
        };

        // Act
        var result = controller.Create(request);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public void GetById_WhenOrderExists_ShouldReturnOk()
    {
        // Arrange
        var controller = new OrdersController();
        var id = Guid.NewGuid();
        var order = new Order { Id = id };

        OrderStore.Orders[id] = order;

        // Act
        var result = controller.GetById(id);

        // Assert
        Assert.IsType<OkObjectResult>(result.Result);
    }

    [Fact]
    public void GetById_WhenOrderDoesNotExist_ShouldReturnNotFound()
    {
        // Arrange
        var controller = new OrdersController();

        // Act
        var result = controller.GetById(Guid.NewGuid());

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }
}
