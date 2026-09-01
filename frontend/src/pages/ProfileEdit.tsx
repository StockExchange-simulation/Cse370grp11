import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Card, PageTitle, PrimaryButton } from "../components/ui";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "w-full rounded-lg border border-line bg-canvas px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/15";

export function ProfileEdit() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setMiddleName(user.middle_name || "");
      setLastName(user.last_name || "");
    }
  }, [user]);

  async function handleSave() {
    setError("");
    setMessage("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          middle_name: middleName || null,
          last_name: lastName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Failed to update profile.");
        return;
      }

      await refreshUser();
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Update failed:", err);
      setError("Something went wrong.");
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-muted transition hover:text-ink"
      >
        <ArrowLeft size={16} /> Back to profile
      </button>

      <PageTitle
        eyebrow="Account"
        title="Edit profile"
        subtitle="Update your personal information."
      />

      <Card className="p-6">
        <label className="mb-4 flex flex-col gap-2 text-xs font-semibold text-ink">
          First name
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="mb-4 flex flex-col gap-2 text-xs font-semibold text-ink">
          Middle name (optional)
          <input
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="mb-4 flex flex-col gap-2 text-xs font-semibold text-ink">
          Last name
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputClass}
          />
        </label>

        {error ? (
          <p className="mb-4 rounded-lg bg-danger/10 px-3 py-2.5 text-xs font-medium text-danger">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="mb-4 flex items-center gap-2 rounded-lg bg-teal/10 px-3 py-2.5 text-xs text-teal">
            <CheckCircle2 size={16} /> {message}
          </p>
        ) : null}

        <PrimaryButton onClick={handleSave}>Save changes</PrimaryButton>
      </Card>
    </div>
  );
}
