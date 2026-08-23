import { FormEvent, useEffect, useState } from "react";
import {
  Activity as ActivityIcon,
  Building2,
  PackagePlus,
  Users,
  Coins,
} from "lucide-react";
import { StatCard } from "../components/StatCard";
import { Card, PageTitle, PrimaryButton } from "../components/ui";

const inputClass =
  "w-full rounded-lg border border-line bg-canvas px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/15";

export function Admin() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [todaysTransactions, setTodaysTransactions] = useState<number | null>(
    null,
  );

  const [company, setCompany] = useState({
    name: "",
    industry: "",
    description: "",
  });
  const [stock, setStock] = useState({
    symbol: "",
    basePrice: "",
    shares: "",
    companyName: "",
    ownerId: "",
  });
  const [companyMessage, setCompanyMessage] = useState("");
  const [stockMessage, setStockMessage] = useState("");
  const [dividend, setDividend] = useState({
    symbol: "",
    perStock: "",
    date: "",
  });
  const [dividendMessage, setDividendMessage] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const usersRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/stats/total-users`,
        { credentials: "include" },
      );
      const usersData = await usersRes.json();
      setTotalUsers(usersData.total_users);

      const trxRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/stats/todays-transactions`,
        { credentials: "include" },
      );
      const trxData = await trxRes.json();
      setTodaysTransactions(trxData.todays_transactions);
    } catch (error) {
      console.error("Failed to load admin stats:", error);
    }
  }

  async function submitCompany(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCompanyMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/companies`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_name: company.name,
            industry: company.industry,
            company_description: company.description,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setCompanyMessage(data.detail || "Failed to add company.");
        return;
      }

      setCompanyMessage("Company added successfully.");
      setCompany({ name: "", industry: "", description: "" });
    } catch (error) {
      console.error("Add company failed:", error);
      setCompanyMessage("Something went wrong.");
    }
  }

  async function submitStock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStockMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/stocks`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            symbol: stock.symbol,
            base_price: Number(stock.basePrice),
            share_count: Number(stock.shares),
            company_name: stock.companyName,
            initial_user_id: Number(stock.ownerId),
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setStockMessage(data.detail || "Failed to add stock.");
        return;
      }

      setStockMessage("Stock added successfully.");
      setStock({
        symbol: "",
        basePrice: "",
        shares: "",
        companyName: "",
        ownerId: "",
      });
    } catch (error) {
      console.error("Add stock failed:", error);
      setStockMessage("Something went wrong.");
    }
  }

  async function submitDividend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDividendMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/dividends`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            symbol: dividend.symbol,
            pay_per_share: Number(dividend.perStock),
            dividend_date: dividend.date,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setDividendMessage(data.detail || "Failed to add dividend.");
        return;
      }

      setDividendMessage("Dividend added successfully.");
      setDividend({ symbol: "", perStock: "", date: "" });
    } catch (error) {
      console.error("Add dividend failed:", error);
      setDividendMessage("Something went wrong.");
    }
  }

  return (
    <>
      <PageTitle
        eyebrow="Administration"
        title="Admin overview"
        subtitle="Platform health and market administration."
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total users"
          value={totalUsers !== null ? totalUsers.toLocaleString() : "..."}
          detail="Registered accounts"
          icon={Users}
        />
        <StatCard
          label="Trades today"
          value={
            todaysTransactions !== null
              ? todaysTransactions.toLocaleString()
              : "..."
          }
          detail="Across all markets"
          icon={ActivityIcon}
          tone="teal"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <div className="mb-5 flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
              <Building2 size={19} />
            </div>
            <div>
              <h2 className="text-[17px] font-semibold tracking-tight text-ink">
                Add new company
              </h2>
              <p className="mt-1 text-xs text-muted">
                Create a company profile for the market.
              </p>
            </div>
          </div>
          <form className="space-y-3.5" onSubmit={submitCompany}>
            <label className="block text-xs font-semibold text-ink">
              Company name
              <input
                required
                value={company.name}
                onChange={(e) =>
                  setCompany({ ...company, name: e.target.value })
                }
                className={`${inputClass} mt-1.5`}
                placeholder="Acme Corporation"
              />
            </label>
            <label className="block text-xs font-semibold text-ink">
              Industry
              <input
                required
                value={company.industry}
                onChange={(e) =>
                  setCompany({ ...company, industry: e.target.value })
                }
                className={`${inputClass} mt-1.5`}
                placeholder="Technology"
              />
            </label>
            <label className="block text-xs font-semibold text-ink">
              Description
              <textarea
                required
                rows={4}
                value={company.description}
                onChange={(e) =>
                  setCompany({ ...company, description: e.target.value })
                }
                className={`${inputClass} mt-1.5 resize-none`}
                placeholder="Describe the company and its business..."
              />
            </label>
            {companyMessage ? (
              <p role="status" className="text-xs font-medium text-teal">
                {companyMessage}
              </p>
            ) : null}
            <PrimaryButton type="submit" className="w-full sm:w-auto">
              Add company
            </PrimaryButton>
          </form>
        </Card>

        <Card>
          <div className="mb-5 flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal/10 text-teal">
              <PackagePlus size={19} />
            </div>
            <div>
              <h2 className="text-[17px] font-semibold tracking-tight text-ink">
                Add new stock
              </h2>
              <p className="mt-1 text-xs text-muted">
                Issue a stock and assign its initial owner.
              </p>
            </div>
          </div>
          <form className="space-y-3.5" onSubmit={submitStock}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block text-xs font-semibold text-ink">
                Stock symbol
                <input
                  required
                  value={stock.symbol}
                  onChange={(e) =>
                    setStock({ ...stock, symbol: e.target.value.toUpperCase() })
                  }
                  className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3 py-2.5 text-sm uppercase text-ink outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/15"
                  placeholder="ACME"
                />
              </label>
              <label className="block text-xs font-semibold text-ink">
                Base price
                <input
                  required
                  min="0.01"
                  step="0.01"
                  type="number"
                  value={stock.basePrice}
                  onChange={(e) =>
                    setStock({ ...stock, basePrice: e.target.value })
                  }
                  className={inputClass + " mt-1.5"}
                  placeholder="100.00"
                />
              </label>
            </div>
            <label className="block text-xs font-semibold text-ink">
              Total share count
              <input
                required
                min="1"
                step="1"
                type="number"
                value={stock.shares}
                onChange={(e) => setStock({ ...stock, shares: e.target.value })}
                className={inputClass + " mt-1.5"}
                placeholder="1000000"
              />
            </label>
            <label className="block text-xs font-semibold text-ink">
              Company name
              <input
                required
                value={stock.companyName}
                onChange={(e) =>
                  setStock({ ...stock, companyName: e.target.value })
                }
                className={inputClass + " mt-1.5"}
                placeholder="Acme Corporation"
              />
            </label>
            <label className="block text-xs font-semibold text-ink">
              Initial owner user ID
              <input
                required
                value={stock.ownerId}
                onChange={(e) =>
                  setStock({ ...stock, ownerId: e.target.value })
                }
                className={inputClass + " mt-1.5"}
                placeholder="1"
              />
            </label>
            {stockMessage ? (
              <p role="status" className="text-xs font-medium text-teal">
                {stockMessage}
              </p>
            ) : null}
            <PrimaryButton
              type="submit"
              tone="accent"
              className="w-full sm:w-auto"
            >
              Add stock
            </PrimaryButton>
          </form>
        </Card>
      </div>

      <Card className="mt-4">
        <div className="mb-5 flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet/10 text-violet">
            <Coins size={19} />
          </div>
          <div>
            <h2 className="text-[17px] font-semibold tracking-tight text-ink">
              Add dividend
            </h2>
            <p className="mt-1 text-xs text-muted">
              Declare a per-share dividend for an existing stock.
            </p>
          </div>
        </div>
        <form
          className="grid grid-cols-1 gap-3.5 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end"
          onSubmit={submitDividend}
        >
          <label className="block text-xs font-semibold text-ink">
            Stock symbol
            <input
              required
              value={dividend.symbol}
              onChange={(e) =>
                setDividend({
                  ...dividend,
                  symbol: e.target.value.toUpperCase(),
                })
              }
              className={`${inputClass} mt-1.5 uppercase`}
              placeholder="ACME"
            />
          </label>
          <label className="block text-xs font-semibold text-ink">
            Dividend per stock
            <input
              required
              min="0.01"
              step="0.01"
              type="number"
              value={dividend.perStock}
              onChange={(e) =>
                setDividend({ ...dividend, perStock: e.target.value })
              }
              className={`${inputClass} mt-1.5`}
              placeholder="0.50"
            />
          </label>
          <label className="block text-xs font-semibold text-ink">
            Dividend date
            <input
              required
              type="date"
              value={dividend.date}
              onChange={(e) =>
                setDividend({ ...dividend, date: e.target.value })
              }
              className={`${inputClass} mt-1.5`}
            />
          </label>
          <PrimaryButton
            type="submit"
            tone="accent"
            className="w-full md:w-auto"
          >
            Add dividend
          </PrimaryButton>
          {dividendMessage ? (
            <p
              role="status"
              className="text-xs font-medium text-teal md:col-span-4"
            >
              {dividendMessage}
            </p>
          ) : null}
        </form>
      </Card>
    </>
  );
}
