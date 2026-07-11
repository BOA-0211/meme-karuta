/* =============================================
   card.js
   URLパラメータ ?id=card-xxx を読み取り、
   ../data/cards.js で定義された CARDS_DATA から
   該当カードを描画する（fetch不要・file://対応）
   ============================================= */

const GALLERY_PATH = "../gallery/";

// -----------------------------------------------
//  メイン処理
// -----------------------------------------------
(async () => {
  const id = getCardId();
  if (!id) {
    showError("カードIDが指定されていません。");
    return;
  }

  // CARDS_DATA は ../data/cards.js でグローバル定義済み
  if (typeof CARDS_DATA === "undefined") {
    showError("カードデータが読み込まれていません。\ndata/cards.js が正しく配置されているか確認してください。");
    return;
  }

  const index = CARDS_DATA.findIndex(r => r.id === id);
  if (index === -1) {
    showError(`カード「${id}」はデータに存在しません。`);
    return;
  }

  const card = CARDS_DATA[index];
  await renderCard(card, id);
  renderPageNav(CARDS_DATA, index);
  setupFlip();
  showPage();
})();

// -----------------------------------------------
//  URLからカードIDを取得
// -----------------------------------------------
function getCardId() {
  const params = new URLSearchParams(location.search);
  return params.get("id") || null;
}

// -----------------------------------------------
//  カード内容を描画
// -----------------------------------------------
async function renderCard(card, id) {
  // タイトル
  document.title = `${card.name || id} | ミームカルタ`;

  // ナビ：カードID表示
  document.getElementById("cardId").textContent = id;

  // カード名
  document.getElementById("cardName").textContent = card.name || id;

  // メタ情報
  document.getElementById("cardOrigin").textContent = card.origin || "—";
  document.getElementById("cardYear").textContent   = card.year   || "—";

  // 説明
  document.getElementById("cardDescription").textContent = card.description || "";

  // 用途
  document.getElementById("cardHowto").textContent = card.howto || "";

  // 備考（空なら非表示）
  const remarksField = document.getElementById("remarksField");
  if (card.remarks && card.remarks.trim() !== "") {
    document.getElementById("cardRemarks").textContent = card.remarks;
  } else {
    remarksField.classList.add("hidden");
  }

  // --- 表面：絵画像 ---
  const imageSrc = GALLERY_PATH + (card.image || `${id}.png`);
  const exists   = await checkImage(imageSrc);
  const imgEl    = document.getElementById("cardImage");
  const noImgEl  = document.getElementById("noImage");
  const noImgLabel = document.getElementById("noImageLabel");

  if (exists) {
    imgEl.src = imageSrc;
    imgEl.alt = card.name || id;
    noImgEl.classList.add("hidden");
  } else {
    imgEl.classList.add("hidden");
    noImgLabel.textContent = `${card.name || id}　画像なし`;
    noImgEl.classList.remove("hidden");
  }

  // --- 裏面：文字画像（card-〇〇_文字.png）---
  const backSrc = GALLERY_PATH + (card.imageBack || `${id}_文字.png`);
  const backExists = await checkImage(backSrc);
  const backImgEl  = document.getElementById("cardBackImage");
  const backPlaceholder = document.getElementById("cardBackPlaceholder");

  if (backExists) {
    backImgEl.src = backSrc;
    backImgEl.alt = `${card.name || id}（文字）`;
    backImgEl.classList.remove("hidden");
    backPlaceholder.classList.add("hidden");
  } else {
    backImgEl.classList.add("hidden");
    backPlaceholder.classList.remove("hidden");
  }
}

// -----------------------------------------------
//  フリップボタンの設定
// -----------------------------------------------
function setupFlip() {
  const wrapper     = document.getElementById("imageFrame");
  const flipBtn     = document.getElementById("flipBtn");
  const flipBtnBack = document.getElementById("flipBtnBack");

  if (!wrapper || !flipBtn) return;

  flipBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    wrapper.classList.add("flipped");
  });

  if (flipBtnBack) {
    flipBtnBack.addEventListener("click", (e) => {
      e.stopPropagation();
      wrapper.classList.remove("flipped");
    });
  }
}

// -----------------------------------------------
//  前後ナビゲーションを描画
// -----------------------------------------------
function renderPageNav(rows, currentIndex) {
  const prevLink = document.getElementById("prevLink");
  const nextLink = document.getElementById("nextLink");

  if (currentIndex > 0) {
    prevLink.href = `./card.html?id=${rows[currentIndex - 1].id}`;
  } else {
    prevLink.classList.add("disabled");
  }

  if (currentIndex < rows.length - 1) {
    nextLink.href = `./card.html?id=${rows[currentIndex + 1].id}`;
  } else {
    nextLink.classList.add("disabled");
  }
}

// -----------------------------------------------
//  画像の存在確認
// -----------------------------------------------
function checkImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload  = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

// -----------------------------------------------
//  表示切替ヘルパー
// -----------------------------------------------
function showPage() {
  document.getElementById("loading").classList.add("hidden");
  document.getElementById("cardPage").classList.remove("hidden");
}

function showError(message) {
  document.getElementById("loading").classList.add("hidden");
  const errEl = document.getElementById("error");
  document.getElementById("errorMessage").textContent = message;
  errEl.classList.remove("hidden");
}
