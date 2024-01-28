async function fetchTechnology(url, key) {
	try {
		const response = await fetch(
			`https://api.builtwith.com/free1/api.json?KEY=${key}&LOOKUP=${url}`,
		);

		if (!response.ok) {
			throw new Error("API request failed");
		}
		const data = await response.json();

		if (data.Errors && data.Errors.length > 0) {
			throw new Error(data.Errors[0].Message);
		}

		return data;
	} catch (error) {
		console.error("Error fetching technology data:", error);
		alert("An error occurred while fetching data.");
		return null;
	}
}

// 結果を表示する関数
function displayResults(data) {
  const mainContainer = document.querySelector(".main-container");
  mainContainer.innerHTML = "";

  if (!data || !data.groups) {
    mainContainer.innerHTML = "<p>No results found</p>";
    return;
  }

  // TLD除去サイト名のため
  const domainWithoutTld = data.domain.split(".").slice(0, -1).join(".");
  // サイト情報表示
  const siteInfo = document.createElement("div");
  siteInfo.className = "site-info";
  // biome-ignore lint/style/useTemplate: <explanation>
siteInfo.innerHTML = "<p>Site: " + domainWithoutTld + "</p><p>URL: " + data.domain + "</p>";
  mainContainer.appendChild(siteInfo);

  const cardContainer = document.createElement("div");
  cardContainer.className = "card-container";

  for (const group of data.groups) {
    const categoriesNames = group.categories?.map((cat) => cat.name).join(", ");
    if (categoriesNames) {
      const card = document.createElement("div");
      card.className = "card";
      // biome-ignore lint/style/useTemplate: <explanation>
card.innerHTML = "<h2 class='card-title'>" + group.name + "</h2><p>Categories: " + categoriesNames + "</p>";
      cardContainer.appendChild(card);
    }
  }
  mainContainer.appendChild(cardContainer);
}
// URLパラメータから検索クエリを取得
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get("search");
const API_KEY = "e9eb2db6-92d7-411b-a725-a6fe2a865558";

// 検索クエリがあれば、APIにリクエストを送信
if (searchQuery) {
	fetchTechnology(searchQuery, API_KEY).then((data) => displayResults(data));
}

// 検索バー未入力の場合検索実行に対して反応を停止
function handleFormSubmit(event) {
	const searchInput = this.search.value.trim();
	if (!searchInput) {
		event.preventDefault(); // フォームの送信を阻止
		return;
	}
}

document
	.getElementById("search-form")
	.addEventListener("submit", handleFormSubmit);

// ページ最上部に戻るボタンの表示・非表示とクリックイベント制御
window.onscroll = () => {
	const button = document.getElementById("back-to-top");
	if (window.scrollY > 200) {
		button.style.display = "block";
	} else {
		button.style.display = "none";
	}
};

document.getElementById("back-to-top").onclick = () => {
	window.scrollTo(0, 0);
};
