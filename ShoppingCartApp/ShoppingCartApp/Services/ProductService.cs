using ShoppingCartApp.Models;

namespace ShoppingCartApp.Services;

public static class ProductService
{
    // In-memory list (replace later with DB)
    public static readonly List<Product> Products =
    [
        new(1, "Wireless Mouse", "Ergonomic wireless mouse", 799.00m, "https://picsum.photos/seed/mouse/300/200"),
        new(2, "Mechanical Keyboard", "Blue switch mechanical keyboard", 2499.00m, "https://picsum.photos/seed/keyboard/300/200"),
        new(3, "USB-C Hub", "7-in-1 USB-C hub", 1299.00m, "https://picsum.photos/seed/hub/300/200"),
        new(4, "Noise-Cancel Headphones", "Over-ear ANC headphones", 3999.00m, "https://picsum.photos/seed/headphones/300/200"),
    ];
}
