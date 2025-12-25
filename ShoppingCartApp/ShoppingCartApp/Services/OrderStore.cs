
using ShoppingCartApp.Models;
using System.Collections.Concurrent;

namespace ShoppingCartApp.Services;

public static class OrderStore
{
    // thread-safe in-memory store
    public static readonly ConcurrentDictionary<Guid, Order> Orders = new();
    public static void Clear()
    {
        Orders.Clear();
    }
}

