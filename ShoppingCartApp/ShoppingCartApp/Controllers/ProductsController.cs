using Microsoft.AspNetCore.Mvc;
using ShoppingCartApp.Models;
using ShoppingCartApp.Services;

namespace ShoppingCartApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<Product>> GetAll()
        => Ok(ProductService.Products);

    [HttpGet("{id:int}")]
    public ActionResult<Product> GetById(int id)
    {
        var product = ProductService.Products.FirstOrDefault(p => p.Id == id);
        return product is null ? NotFound() : Ok(product);
    }
}
