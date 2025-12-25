using Microsoft.AspNetCore.Mvc;
using ShoppingCartApp.Dtos;
using ShoppingCartApp.Models;
using ShoppingCartApp.Services;

namespace ShoppingCartApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    [HttpPost]
    public ActionResult Create([FromBody] CreateOrderRequest req)
    {
        // Basic validation (you can swap to FluentValidation later)
        if (req.Items is null || req.Items.Count == 0)
            return BadRequest(new { message = "Cart items are required." });

        if (string.IsNullOrWhiteSpace(req.Customer?.Name))
            return BadRequest(new { message = "Name is required." });

        if (string.IsNullOrWhiteSpace(req.Customer?.Email))
            return BadRequest(new { message = "Email is required." });

        if (string.IsNullOrWhiteSpace(req.Customer?.Phone))
            return BadRequest(new { message = "Phone is required." });

        if (string.IsNullOrWhiteSpace(req.Customer?.Address))
            return BadRequest(new { message = "Address is required." });

        // Validate qty
        if (req.Items.Any(i => i.Qty <= 0))
            return BadRequest(new { message = "Qty must be >= 1." });

        // Build order lines from real product data (server-side truth)
        var lines = new List<OrderLine>();
        foreach (var item in req.Items)
        {
            var product = ProductService.Products.FirstOrDefault(p => p.Id == item.ProductId);
            if (product is null)
                return BadRequest(new { message = $"Invalid productId: {item.ProductId}" });

            lines.Add(new OrderLine
            {
                ProductId = product.Id,
                ProductName = product.Name,
                UnitPrice = product.Price,
                Qty = item.Qty,
                LineTotal = product.Price * item.Qty
            });
        }

        var subtotal = lines.Sum(l => l.LineTotal);
        var total = subtotal; // add shipping/discount/tax here later

        var order = new Order
        {
            Customer = new Customer
            {
                Name = req.Customer.Name.Trim(),
                Email = req.Customer.Email.Trim(),
                Phone = req.Customer.Phone.Trim(),
                Address = req.Customer.Address.Trim()
            },
            Location = new Location { Lat = req.Location.Lat, Lng = req.Location.Lng },
            Lines = lines,
            Subtotal = subtotal,
            Total = total
        };

        OrderStore.Orders[order.Id] = order;

        // Return 201 + location of created order
        return CreatedAtAction(nameof(GetById), new { id = order.Id }, new
        {
            orderId = order.Id,
            order.CreatedAt,
            order.Subtotal,
            order.Total
        });
    }

    [HttpGet("{id:guid}")]
    public ActionResult<Order> GetById(Guid id)
    {
        return OrderStore.Orders.TryGetValue(id, out var order)
            ? Ok(order)
            : NotFound();
    }

    // Optional (for debugging)
    [HttpGet]
    public ActionResult<IEnumerable<Order>> GetAll()
        => Ok(OrderStore.Orders.Values.OrderByDescending(o => o.CreatedAt));
}
