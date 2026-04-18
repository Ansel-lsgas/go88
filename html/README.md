## How to install
1. Install: `npm install`
2. To start the development server, watch for file changes: `npm start`


# Quy ước viết Pug (semantic) và class CSS theo BEM

Tài liệu ngắn gọn giúp thống nhất cấu trúc Pug và đặt tên class CSS theo BEM trong project `html/`.

## Contract
- Input: Pug templates (partials/mixins/pages) và SASS/CSS.
- Output: Pug dùng thẻ semantic + mixin rõ ràng; class theo BEM (kebab-case); SASS dễ maintain.
- Mục tiêu: dễ đọc, ít coupling giữa style và JS, dễ reuse component.

## Nguyên tắc chung cho Pug (semantic)
- Dùng thẻ HTML semantic khi có thể (header, nav, main, footer, section, article, aside, figure...).
- Tránh dùng <div> chỉ để đặt tên; nếu phần tử có ý nghĩa, dùng thẻ semantic.
- Sử dụng mixins cho component tái sử dụng (ví dụ: +dropdownLinks(), +linkList()) và truyền class/props qua tham số.
- Không để logic presentational trong template (ví dụ inline style). Sử dụng class để gán style.
- Accessibility: thêm aria-label, role, alt cho img, title khi cần.

## Quy ước đặt tên class theo BEM
- Format chung (kebab-case):
  - Block: .block-name (ví dụ: `.site-header`, `.matches__container` là block `matches` + `__container` là element — lưu ý: nếu bạn đã có tiền tố site- dùng nhất quán)
  - Element: .block-name__element-name (double underscore)
  - Modifier: .block-name--modifier-name (double hyphen)

- Quy tắc chi tiết:
  1. Luôn viết chữ thường, ngăn cách bằng `-` (kebab-case).
  2. Elements gắn với block cụ thể: không dùng element độc lập (`.__title` không hợp lệ).
  3. Modifiers mô tả biến thể (state hoặc style) của block/element: `.block--large`, `.block__item--active`.
  4. Trạng thái động (JS state) sử dụng dạng `is-` hoặc `has-` prefix: `.is-open`, `.has-active`. Dùng cho trạng thái toàn cục hoặc cross-block; không dùng để styling chủ yếu.
  5. Không dùng class tên theo màu/kiểu (ví dụ `.red`, `.big`) trừ khi là utility rõ ràng (utilities nên nằm trong layer utilities của Tailwind/SASS).

## SASS / SCSS patterns (ví dụ)
Ví dụ block `site-header`:

```sass
.site-header
  // block base styles
  &__nav
    // element styles
  &__list
    &--sticky
      // modifier styles

// sử dụng 1 mức lồng tối đa cho element; modifier dùng cùng hàng với block/element bằng &--modifier
```

Concrete example (áp dụng vào project):

```sass
.site-header
  @apply bg-main-reverse py-3

  &__nav
    @apply flex items-center

  &--sticky
    position: fixed
    top: 0
```

## Ví dụ chuyển Pug sang BEM + data-js
Pug hiện tại (ví dụ header):

```pug
header(class="site-section site-header")
  nav(class="site-section__row site-header__nav")
    button(class="site-header__menu-toggle")
```

Giữ block/element như trên; thêm data-js cho behavior:

```pug
header.site-header.site-section
  nav.site-header__nav.site-section__row(aria-label="Header main navigation")
    button.site-header__menu-toggle(data-js="menu-toggle" aria-expanded="false")
```

JS: chọn bằng `document.querySelector('[data-js="menu-toggle"]')` thay vì `.site-header__menu-toggle`.

## Edge cases & gợi ý
- Khi component chứa nhiều sub-components độc lập (ví dụ `matches__container` có nhiều `match__item`), coi `match` là block riêng nếu cần reuse.
- Nếu một block quá dài/complex, tách ra thành block con thay vì nhiều level element (giữ rõ ràng domain của block).
- Tránh lồng CSS sâu > 3 level; dùng composition hoặc block riêng.

## Migration checklist (nhỏ)
1. Xác định block chính cho partial (ví dụ: `_header.pug` -> block `site-header`).
2. Đổi tên các class element cho chuẩn `block__element`.
3. Modifiers: chuyển class trạng thái thành `--modifier` hoặc `is-`/`has-` cho JS state.
4. Bổ sung `data-js` cho các trigger JS.

## Cheatsheet ngắn
- Block: `.block-name`
- Element: `.block-name__element-name`
- Modifier: `.block-name--modifier-name` or `.block-name__elem--modifier`
- JS hooks: `data-js="..."`
- State classes: `.is-active`, `.is-open`, `.has-error`
