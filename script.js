body {
  font-family: system-ui, sans-serif;
  margin: 0;
  background: #f4f4f7;
  color: #1a1a1a;
}

header {
  background: linear-gradient(135deg, #4e8df5, #6b5bff);
  color: white;
  padding: 40px 20px;
  text-align: center;
}

header h1 {
  margin: 0;
  font-size: 42px;
  font-weight: 800;
}

main {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.card {
  background: white;
  padding: 30px;
  width: 100%;
  max-width: 600px;
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.card h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: 700;
}

.form-group {
  margin-bottom: 18px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

input, textarea, select {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
}

textarea {
  height: 90px;
}

button {
  padding: 14px 24px;
  background: #4e8df5;
  border: none;
  color: white;
  font-size: 18px;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
  transition: 0.2s;
}

button:hover {
  background: #3e7ce0;
}

#loader {
  margin-top: 18px;
  font-size: 16px;
  color: #555;
}

.hidden {
  display: none;
}

#outputSection {
  margin-top: 30px;
  padding: 20px;
  background: #f0f2ff;
  border-radius: 12px;
}

pre {
  white-space: pre-wrap;
  font-size: 15px;
}
