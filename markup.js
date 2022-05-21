const renderInfo = function (data) {
  return `
 <div class="content">
              <p class="title">IP ADDRESS</p>
              <h2 class="title-content">${data.ip}</h2>
            </div>
            <div class="content">
              <p class="title">LOCATION</p>
              <h2 class="title-content">${data.location.city}, ${data.location.region}, ${data.location.postalCode}</h2>
            </div>
            <div class="content">
              <p class="title">TIMEZONE</p>
              <h2 class="title-content">UTC${data.location.timezone}</h2>
            </div>
            <div class="content">
              <p class="title">ISP</p>
              <h2 class="title-content">${data.isp}</h2>
            </div>
    `;
};

export { renderInfo };
