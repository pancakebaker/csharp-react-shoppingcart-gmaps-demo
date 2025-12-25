import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/renderWithProviders";
import CartPage from "./CartPage";

describe("CartPage", () => {
  it("shows empty cart message", () => {
    renderWithProviders(<CartPage />);
    expect(screen.getByRole("heading", { name: /cart is empty/i }))
      .toBeInTheDocument();
  });
});
