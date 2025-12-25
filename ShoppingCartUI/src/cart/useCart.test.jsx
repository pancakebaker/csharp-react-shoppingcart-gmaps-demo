import { renderHook, act } from "@testing-library/react";
import { CartProvider } from "./CartProvider";
import { useCart } from "./useCart";

const wrapper = ({ children }) => (
    <CartProvider>{children}</CartProvider>
);

describe("useCart", () => {
    it("adds item to cart", () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addToCart({
                id: 1,
                name: "Apple",
                price: 10,
            });
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].qty).toBe(1);
    });

    it("increments quantity when adding same item", () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addToCart({ id: 1, name: "Apple", price: 10 });
            result.current.addToCart({ id: 1, name: "Apple", price: 10 });
        });

        expect(result.current.items[0].qty).toBe(3);
    });

    it("removes item from cart", () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addToCart({ id: 1, name: "Apple", price: 10 });
            result.current.removeFromCart(1);
        });

        expect(result.current.items).toHaveLength(0);
    });

    it("calculates total price", () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addToCart({ id: 1, name: "Apple", price: 10 });
            result.current.addToCart({ id: 2, name: "Banana", price: 5 });
        });

        // totals keys vary; ensure some value equals 15
        expect(Object.values(result.current.totals)).toContain(15);
    });

});
