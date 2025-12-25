namespace ShoppingCartApp.Dtos;

public sealed class CreateOrderRequest
{
    public CustomerDto Customer { get; init; } = new();
    public LocationDto Location { get; init; } = new();
    public List<OrderItemDto> Items { get; init; } = new();
}

public sealed class CustomerDto
{
    public string Name { get; init; } = "";
    public string Email { get; init; } = "";
    public string Phone { get; init; } = "";
    public string Address { get; init; } = "";
}

public sealed class LocationDto
{
    public double Lat { get; init; }
    public double Lng { get; init; }
}

public sealed class OrderItemDto
{
    public int ProductId { get; init; }
    public int Qty { get; init; }
}
