/*
 * Count page views form GA or local cache file.
 *
 * Dependencies:
 *   - jQuery
 *   - countUp.js <https://github.com/inorganik/countUp.js>
 */

const getInitStatus = (function () {
  let hasInit = false;
  return () => {
    let ret = hasInit;
    if (!hasInit) {
      hasInit = true;
    }
    return ret;
  };
}());

const PvOpts = (function () {
  return {
    getProxyEndpoint() {
      return $("meta[name=pv-proxy-endpoint]").attr("content");
    },
    getLocalData() {
      return $("meta[name=pv-cache-path]").attr("content");
    },
    hasLocalData() {
      let path = PvOpts.getLocalData();
      return (typeof path !== "undefined" && path !== false);
    }
  }
}());

const PvData = (function () {
  const KEY_PV = "pv";
  const KEY_CREATION = "pv_created_date";
  const KEY_PV_SRC = "pv_source";

  const Source = {
    ORIGIN: "origin",
    PROXY: "proxy"
  };

  function get(key) {
    return localStorage.getItem(key);
  }

  function set(key, val) {
    localStorage.setItem(key, val);
  }

  return {
    getData() {
      // get data from browser cache
      return JSON.parse(localStorage.getItem(KEY_PV));
    },
    saveOriginCache(pv) {
      set(KEY_PV, pv);
      set(KEY_PV_SRC, Source.ORIGIN);
      set(KEY_CREATION, new Date().toJSON());
    },
    saveProxyCache(pv) {
      set(KEY_PV, pv);
      set(KEY_PV_SRC, Source.PROXY);
      set(KEY_CREATION, new Date().toJSON());
    },
    isFromOrigin() {
      return get(KEY_PV_SRC) === Source.ORIGIN;
    },
    isFromProxy() {
      return get(KEY_PV_SRC) === Source.PROXY;
    },
    isExpired() {
      if (PvData.isFromOrigin()) {
        let date = new Date(get(KEY_CREATION));
        date.setDate(date.getDate() + 1); /* update origin records every day */
        return Date.now() >= date.getTime();

      } else if (PvData.isFromProxy()) {
        let date = new Date(get(KEY_CREATION));
        date.setHours(date.getHours() + 1); /* update proxy records per hour */
        return Date.now() >= date.getTime();
      }
      return false;
    },
    getAllPageviews() {
      return PvData.getData().totalsForAllResults["ga:pageviews"];
    },
    newerThan(pv) {
      return PvData.getAllPageviews() > pv.totalsForAllResults["ga:pageviews"];
    },
    inspectKeys() {
      if (localStorage.getItem(KEY_PV) === null
        || localStorage.getItem(KEY_PV_SRC) === null
        || localStorage.getItem(KEY_CREATION) === null) {
        localStorage.clear();
      }
    }
  };

}()); /* PvData */


function countUp(min, max, destId) {
  if (min < max) {
    let numAnim = new CountUp(destId, min, max);
    if (!numAnim.error) {
      numAnim.start();
    } else {
      console.error(numAnim.error);
    }
  }
}


function countPV(path, rows) {
  let count = 0;

  if (typeof rows !== "undefined" ) {
    for (let i = 0; i < rows.length; ++i) {
      const gaPath = rows[parseInt(i, 10)][0];
      if (gaPath === path) { /* path format see: site.permalink */
        count += parseInt(rows[parseInt(i, 10)][1], 10);
        break;
      }
    }
  }

  return count;
}


function tacklePV(rows, path, elem, hasInit) {
  let count = countPV(path, rows);
  count = (count === 0 ? 1 : count);

  if (!hasInit) {
    elem.text(new Intl.NumberFormat().format(count));
  } else {
    const initCount = parseInt(elem.text().replace(/,/g, ""), 10);
    if (count > initCount) {
      countUp(initCount, count, elem.attr("id"));
    }
  }
}


function displayPageviews(data) {
  if (typeof data === "undefined") {
    return;
  }

  let hasInit = getInitStatus();
  const rows = data.rows; /* could be undefined */

  if ($("#post-list").length > 0) { /* the Home page */
    $(".post-preview").each(function() {
      const path = $(this).find("a").attr("href");
      tacklePV(rows, path, $(this).find(".pageviews"), hasInit);
    });

  } else if ($(".post").length > 0) { /* the post */
    const path = window.location.pathname;
    tacklePV(rows, path, $("#pv"), hasInit);
  }
}


function fetchProxyPageviews() {
  $.ajax({
    type: "GET",
    url: PvOpts.getProxyEndpoint(),
    dataType: "jsonp",
    jsonpCallback: "displayPageviews",
    success: (data, textStatus, jqXHR) => {
      PvData.saveProxyCache(JSON.stringify(data));
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Failed to load pageviews from proxy server: " + errorThrown);
    }
  });
}


function fetchPageviews(fetchOrigin = true, coverOrigin = false) {
  if (fetchOrigin) {
    fetch(PvOpts.getLocalData())
      .then((response) => response.json())
      .then((data) => {
        if (coverOrigin) {
          if (PvData.newerThan(data)) {
            return;
          }
        }
        displayPageviews(data);
        PvData.saveOriginCache(JSON.stringify(data));
      })
      .then(() => fetchProxyPageviews());

  } else {
    fetchProxyPageviews();
  }

}


$(function() {
  if ($(".pageviews").length <= 0) {
    return;
  }

  PvData.inspectKeys();
  let data = PvData.getData();

  if (data) {
    displayPageviews(data);

    if (PvData.isExpired()) {
      fetchPageviews(true, PvData.isFromProxy());

    } else {

      if (PvData.isFromOrigin()) {
        fetchPageviews(false);
      }

    }

  } else {
    fetchPageviews(PvOpts.hasLocalData());
  }

});
