import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../cart/CartProvider";
import { render } from "@testing-library/react";

const CART_STORAGE_KEY = "shopping_cart_v1";

export function renderWithProviders(ui, { route = "/", cartItems = [] } = {}) {
    if (cartItems.length > 0) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }

    return render(
        <MemoryRouter initialEntries={[route]}>
            <CartProvider>
                {ui}
            </CartProvider>
        </MemoryRouter>
    );
}
