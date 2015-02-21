/**
 * options:
 * yearFrom {number} начальный год в селекторе
 * yearTo {number} конечный год в селекторе
 * value {Date} текущая выбранная дата
 */
function DateSelector(options) {
  var self = this;

  var monthNames = "январь февраль март апрель май июнь июль август сентябрь октябрь ноябрь декабрь".split(" ");
  var template = _.template(options.template);
  var value = options.value;

  var elem, yearElem, monthElem, dayElem;

  function render() {
    elem = $(template({
      yearFrom: options.yearFrom,
      yearTo: options.yearTo,
      monthNames: monthNames,
      monthLength: getMonthLength(value),
    }));

    yearElem = elem.find(".year").change(onDateChange);
    monthElem = elem.find(".month").change(onDateChange);
    dayElem = elem.find(".day").change(onDateChange);

    selectValue();

    return elem;
  }

  function getMonthLength(date) {
    return (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();
  }

  self.getElement = function() {
    return elem || render();
  }

  self.setValue = function(date, quiet) {
    value = date;

    dayElem.empty();
    for (var i = 1; i <= getMonthLength(value); i++) {
      dayElem.append($("<option/>", {
        value: i,
        html: i,
      }));
    };

    selectValue();

    if (!quiet) {
      $(self).triggerHandler({
        type: "select",
        value: value,
      });
    };
  }

  function selectValue() {
    dayElem.val(value.getDate());
    monthElem.val(value.getMonth());
    yearElem.val(value.getFullYear());
  }

  function onDateChange() {
    var newDate = new Date(yearElem.val(), monthElem.val(), 1);

    if (getMonthLength(newDate) >= dayElem.val()) {
      newDate.setDate(dayElem.val());
    };

    self.setValue(newDate);
  }
}