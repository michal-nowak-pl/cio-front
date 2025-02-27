import React, { useEffect, useState } from 'react';

interface AccountData {
  id: number;
  email: string;
  // Add other fields as necessary
}

const Account: React.FC = () => {
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountData = async () => {
      const token = localStorage.getItem("apiToken"); // Retrieve the token from local storage
      if (!token) {
        setError("No API token found. Please sign up first.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/account', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: AccountData = await response.json();
        setAccountData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Account Information</h1>
      <pre>{JSON.stringify(accountData, null, 2)}</pre>
    </div>
  );
};

export default Account;