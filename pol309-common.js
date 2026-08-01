/* Shared by index.html, pol309-tracker.html, and pol309-grades.html:
   which POL309 term is "current" by date, and which term a page/link
   should show. Season boundaries: Spring runs Dec 19 – May 20 (labeled
   with the year it ENDS in, so it pairs with the prior fall the way an
   academic year does), Summer runs May 21 – Aug 19, Fall runs Aug 20 –
   Dec 18. */
(function (global) {
  function seasonLabelForDate(date) {
    var y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
    var code = m * 100 + d;
    if (code <= 520) return "Spring " + y;          // Jan 1 – May 20
    if (code <= 819) return "Summer " + y;           // May 21 – Aug 19
    if (code <= 1218) return "Fall " + y;             // Aug 20 – Dec 18
    return "Spring " + (y + 1);                       // Dec 19 – Dec 31
  }

  function queryTerm() {
    var m = /[?&]term=([^&]+)/.exec(location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }

  /* query ?term= wins when it names a real term; otherwise the term
     whose label matches today's date; otherwise the last term in the
     list (assumed chronological), so an unlisted future date still
     resolves to something rather than nothing */
  function pickTerm(terms, opts) {
    opts = opts || {};
    if (!Array.isArray(terms) || !terms.length) return null;
    if (opts.queryTerm) {
      var byId = terms.filter(function (t) { return t.id === opts.queryTerm; })[0];
      if (byId) return byId;
    }
    var label = seasonLabelForDate(opts.date || new Date());
    var byLabel = terms.filter(function (t) { return t.label === label; })[0];
    if (byLabel) return byLabel;
    return terms[terms.length - 1];
  }

  function fetchContent() {
    return fetch("data/content.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  global.POL309 = {
    seasonLabelForDate: seasonLabelForDate,
    queryTerm: queryTerm,
    pickTerm: pickTerm,
    fetchContent: fetchContent
  };
})(window);
