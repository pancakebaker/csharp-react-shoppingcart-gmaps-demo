using System;
using System.Linq;
using ShoppingCartApp.Services;
using Xunit;

namespace ShoppingCartApp.Tests.Services;

public class ProductServiceTests
{
    [Fact]
    public void Products_ShouldBeSeeded()
    {
        // Act
        var products = ProductService.Products;

        // Assert
        Assert.NotNull(products);
        Assert.Equal(4, products.Count);
    }

    [Fact]
    public void Products_ShouldContainExpectedProductIds()
    {
        // Act
        var ids = ProductService.Products.Select(p => p.Id).ToList();

        // Assert
        Assert.Equal(new[] { 1, 2, 3, 4 }, ids.OrderBy(i => i));
    }

    [Fact]
    public void Products_ShouldHaveValidFields()
    {
        foreach (var p in ProductService.Products)
        {
            Assert.True(p.Id > 0);
            Assert.False(string.IsNullOrWhiteSpace(p.Name));
            Assert.False(string.IsNullOrWhiteSpace(p.Description));
            Assert.True(p.Price > 0);
            Assert.False(string.IsNullOrWhiteSpace(p.ImageUrl));
        }
    }

    [Fact]
    public void Products_ImageUrl_ShouldBeValidHttps()
    {
        foreach (var p in ProductService.Products)
        {
            Assert.True(IsValidHttpsUrl(p.ImageUrl));
        }
    }

    private static bool IsValidHttpsUrl(string url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out var uri)
               && uri.Scheme == Uri.UriSchemeHttps;
    }
}
