namespace ShoppingCartApp.Models;

public sealed class Order
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;

    public Customer Customer { get; init; } = new();
    public Location Location { get; init; } = new();

    public List<OrderLine> Lines { get; init; } = new();

    public decimal Subtotal { get; init; }
    public decimal Total { get; init; }
}

public sealed class Customer
{
    public string Name { get; init; } = "";
    public string Email { get; init; } = "";
    public string Phone { get; init; } = "";
    public string Address { get; init; } = "";
}

public sealed class Location
{
    public double Lat { get; init; }
    public double Lng { get; init; }
}

public sealed class OrderLine
{
    public int ProductId { get; init; }
    public string ProductName { get; init; } = "";
    public decimal UnitPrice { get; init; }
    public int Qty { get; init; }
    public decimal LineTotal { get; init; }
}
