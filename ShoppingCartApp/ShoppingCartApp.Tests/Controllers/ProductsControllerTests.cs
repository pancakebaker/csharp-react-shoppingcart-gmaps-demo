using Microsoft.AspNetCore.Mvc;
using ShoppingCartApp.Controllers;
using Xunit;

namespace ShoppingCartApp.Tests.Controllers;

public class ProductsControllerTests
{
    [Fact]
    public void GetAll_ShouldReturnOk_WithProducts()
    {
        // Arrange
        var controller = new ProductsController();

        // Act
        var result = controller.GetAll();

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result.Result);
        Assert.NotNull(ok.Value);
    }

    [Fact]
    public void GetById_WhenNotFound_ShouldReturnNotFound()
    {
        // Arrange
        var controller = new ProductsController();

        // Act
        var result = controller.GetById(999);

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }
}
