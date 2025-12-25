import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/renderWithProviders";
import CheckoutPage from "./CheckoutPage";

describe("CheckoutPage", () => {
  it("renders checkout form", () => {
    renderWithProviders(<CheckoutPage />);

    expect(screen.getByRole("heading", { name: /checkout/i }))
      .toBeInTheDocument();

    expect(screen.getByRole("button", { name: /place order/i }))
      .toBeInTheDocument();
  });
});
