import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import LandingPage from "../pages/public/LandingPage.jsx";

afterEach(cleanup);

function renderLanding() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  );
}

describe("mini-quiz sa landing page", () => {
  it("nagpapakita ng tamang feedback kapag Polis ang pinili", async () => {
    const user = userEvent.setup();
    renderLanding();

    await user.click(screen.getByRole("button", { name: /polis/i }));

    expect(screen.getByText(/tama! \+15 xp/i)).toBeTruthy();
    expect(screen.getByText(/nagsimula ang ideya ng demokrasya/i)).toBeTruthy();
  });

  it("sinasabi ang tamang sagot at nakakapag-reset", async () => {
    const user = userEvent.setup();
    renderLanding();

    await user.click(screen.getByRole("button", { name: /imperyo/i }));
    expect(screen.getByText(/hindi pa\. polis ang tamang sagot/i)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /subukan ulit/i }));
    expect(screen.queryByText(/hindi pa\./i)).toBeNull();
  });
});
