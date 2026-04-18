// function isMienBac(operatorVal) {
//     return operatorVal === 'mien_bac';
//   }

//   function getRequiredLength(operatorVal) {
//       return isMienBac(operatorVal) ? 5 : 6;
//   }

//   function updateTicketRule(operatorVal) {
//       var ticketInput = document.getElementById('dvsPage-ticket');
//       var ticketError = document.getElementById('dvsPage-ticket-error');
//       var len = getRequiredLength(operatorVal);
//       if (ticketInput) {
//           ticketInput.maxLength = len;
//           ticketInput.pattern   = '\\d{' + len + '}';
//           ticketInput.value = ticketInput.value.replace(/\D/g, '').slice(0, len);
//       }
//       if (ticketError) {
//           ticketError.textContent = 'Vui lòng nhập đủ ' + len + ' chữ số.';
//           ticketError.classList.add('hidden');
//       }
//   }

//   function updateProvinces(dateStr) {
//       var provinceSchedule = document.getElementById('dvsPage-province-schedule') ? JSON.parse(document.getElementById('dvsPage-province-schedule').value) : {};
//       var parts = dateStr.split('/');
//       if (parts.length !== 3) return;
//       var dow   = (new Date(parts[2], parts[1] - 1, parts[0])).getDay();
  
//       var provinces = provinceSchedule[dow] || provinceSchedule[3];
//       var dropdownList = document.querySelector('#operator_input ul.dropdown__list');
//       if (!dropdownList) return;

//       dropdownList.innerHTML = provinces.map(function (province) {
//         return '<li class="dropdown__item" data-value="' + province.value + '">' + province.label + '</li>';
//       }).join('');
//       var inputHidden = document.querySelector('#operator_input input[type="hidden"]');
//       var operatorLabel = document.querySelector('#operator_input .dropdown__label');
//       operatorLabel.innerHTML = provinces[0].label;
//       inputHidden.value = provinces[0].value
//       updateTicketRule(inputHidden.value);
//   }

// document.addEventListener("DOMContentLoaded", function () {
//   var form = document.getElementById('dovesoPageForm');
//   var inputDate = document.getElementById('dvsPage-date-input');
//   if (inputDate) {
//       inputDate.addEventListener('change', function () {
//           updateProvinces(this.value);
//       });
//   }

//   document.addEventListener('lotteryDateChange', function (e) {
//     if (e.detail && e.detail.dateStr) {
//         updateProvinces(e.detail.dateStr);
//         var dateInput = document.getElementById('dvsPage-date-input');
//         if (dateInput) dateInput.value = e.detail.dateStr;
//     }
//   });
  
//   var operatorSelect = document.getElementById('dvsPage-operator');

//   if (operatorSelect) {
//       updateTicketRule(operatorSelect.value);

//       operatorSelect.addEventListener('change', function () {
//           updateTicketRule(this.value);
//       });
//   }

//   var form = document.getElementById('dovesoPageForm');

//   if (form) {
//       var ticketInput = document.getElementById('dvsPage-ticket');
//       var ticketError = document.getElementById('dvsPage-ticket-error');
//       form.addEventListener('submit', function (e) {
//           e.preventDefault();
//           var val        = ticketInput ? ticketInput.value : '';
//           var operator   = operatorSelect ? operatorSelect.value : '';
//           var reqLen     = getRequiredLength(operator);

//           if (val.length !== reqLen) {
//               if (ticketError) ticketError.classList.remove('hidden');
//               if (ticketInput) ticketInput.focus();
//               return;
//           }
//           if (ticketError) ticketError.classList.add('hidden');

//           var dateVal = document.getElementById('dvsPage-date-input') ? document.getElementById('dvsPage-date-input').value : '';

//           var params = new URLSearchParams({
//               date:     dateVal,
//               operator: operator,
//               ticket:   val
//           });
//           var doVeSoUrl = document.getElementById('dvsPage-do-ve-so-url') ? document.getElementById('dvsPage-do-ve-so-url').value : '';
//           window.location.href = doVeSoUrl + '?' + params.toString();
//       });

//       if (ticketInput) {
//           ticketInput.addEventListener('input', function () {
//               var operator = operatorSelect ? operatorSelect.value : '';
//               var maxLen   = getRequiredLength(operator);
//               this.value   = this.value.replace(/\D/g, '').slice(0, maxLen);
//               if (ticketError && this.value.length === maxLen) {
//                   ticketError.classList.add('hidden');
//               }
//           });
//       }
//   }
// });

//# sourceMappingURL=do-ve-so.js.map
