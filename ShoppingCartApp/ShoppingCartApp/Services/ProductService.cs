using ShoppingCartApp.Models;

namespace ShoppingCartApp.Services;

public static class ProductService
{
    // In-memory list (replace later with DB)
    public static readonly List<Product> Products =
    [
        new(1, "Wireless Mouse", "Ergonomic wireless mouse", 799.00m, "/products/wireless-mouse.jpg"),
        new(2, "Mechanical Keyboard", "Blue switch mechanical keyboard", 2499.00m, "/products/mechanical-keyboard.jpg"),
        new(3, "USB-C Hub", "7-in-1 USB-C hub", 1299.00m, "/products/usb-c-hub.jpg"),
        new(4, "Noise-Cancel Headphones", "Over-ear ANC headphones", 3999.00m, "/products/noise-cancel-headphones.jpg"),
    ];
}
