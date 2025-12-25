import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../cart/CartProvider";
import { render } from "@testing-library/react";

export function renderWithProviders(ui, { route = "/" } = {}) {
    return render(
        <MemoryRouter initialEntries={[route]}>
            <CartProvider>
                {ui}
            </CartProvider>
        </MemoryRouter>
    );
}
