import { useState } from "react";

function App() {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const handleSearch = async (queryText = searchText) => {
  const finalQuery = queryText.trim();

  if (!finalQuery) {
    setMessage("Please enter a surgical kit name");
    setResults([]);
    return;
  }

  try {
    setSearchText(finalQuery);
    setMessage("Searching...");

    const response = await fetch(
      `http://127.0.0.1:8000/search?item_name=${encodeURIComponent(finalQuery)}`
    );

    const data = await response.json();

    setResults(data.results);
    setMessage(`${data.results_count} pharmacies found`);
  } catch (error) {
    setMessage("Backend connection failed");
    setResults([]);
  }
};

  const formatDateTime = (dateText) => {
  const date = new Date(dateText);

  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};


  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>SurgiMap</h1>

        <p style={styles.subtitle}>
          Find nearby pharmacies with urgent surgical kits
        </p>

        <div style={styles.searchBox}>
          <input
            style={styles.input}
            type="text"
            placeholder="Search surgical kit e.g. caesarean"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <button style={styles.button} onClick={handleSearch}>
            Search
          </button>
        </div>

        <div style={styles.suggestions}>
          {["caesarean", "appendix", "suture", "dressing", "general surgery"].map(
            (item) => (
              <button
                key={item}
                style={styles.suggestionButton}
                onClick={() => handleSearch(item)}
              >
                {item}
              </button>
            )
          )}
        </div>

        <p style={styles.message}>{message}</p>

        {message === "0 pharmacies found" && (
          <div style={styles.emptyState}>
            <h3>No pharmacies found</h3>
            <p>
              Try searching another surgical kit name such as caesarean, appendix,
              suture, dressing, or general surgery.
            </p>
          </div>
        )}

        <div style={styles.results}>
          {results.map((item, index) => (
            <div key={index} style={styles.resultCard}>
              <div style={styles.cardHeader}>
                <h3 style={styles.pharmacyName}>{item.pharmacy_name}</h3>

                <span
                  style={{
                    ...styles.badge,
                    backgroundColor:
                      item.status === "Available" ? "#dcfce7" : "#fef3c7",
                    color:
                      item.status === "Available" ? "#166534" : "#92400e",
                  }}
                >
                  {item.status}
                </span>
              </div>

              <p><strong>Item:</strong> {item.standard_item_name}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Distance:</strong> {item.distance_km} km</p>
              <p><strong>Address:</strong> {item.address}</p>
              <p><strong>Last Updated:</strong> {formatDateTime(item.last_updated)}</p>

              <div style={styles.actionButtons}>
                <a href={`tel:${item.phone}`} style={styles.actionButton}>
                  Call
                </a>

                <a
                  href={item.whatsapp_link}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.actionButton}
                >
                  WhatsApp
                </a>

                <a
                  href={item.maps_link}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.actionButton}
                >
                  Map
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f7fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "Arial, sans-serif",
    padding: "40px",
  },
  card: {
    width: "700px",
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  title: {
    fontSize: "42px",
    marginBottom: "10px",
    color: "#102a43",
  },
  subtitle: {
    fontSize: "16px",
    color: "#627d98",
    marginBottom: "30px",
  },
  searchBox: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #bcccdc",
    fontSize: "15px",
  },
  button: {
    padding: "14px 22px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "15px",
    cursor: "pointer",
  },
  message: {
    marginTop: "20px",
    color: "#334e68",
  },
  results: {
    marginTop: "20px",
    textAlign: "left",
  },
  resultCard: {
    border: "1px solid #d9e2ec",
    borderRadius: "12px",
    padding: "18px",
    marginBottom: "14px",
    backgroundColor: "#f8fafc",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  pharmacyName: {
    marginTop: 0,
    color: "#102a43",
  },
  badge: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "bold",
  },
  actionButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },
  actionButton: {
    textDecoration: "none",
    backgroundColor: "#2563eb",
    color: "white",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
  },
  emptyState: {
    backgroundColor: "#fff7ed",
    border: "1px solid #fed7aa",
    color: "#9a3412",
    padding: "18px",
    borderRadius: "12px",
    marginTop: "20px",
    textAlign: "left",
},
suggestions: {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "14px",
  justifyContent: "center",
},

suggestionButton: {
  border: "1px solid #bfdbfe",
  backgroundColor: "#eff6ff",
  color: "#1d4ed8",
  padding: "8px 12px",
  borderRadius: "999px",
  cursor: "pointer",
  fontSize: "14px",
},
};

export default App;