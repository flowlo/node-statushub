var rest = require('restler');
var merge = require('hashish').merge;

module.exports = function StatusHub(key) {
  this.key = key;
  this.root = 'https://statushub.io/api/';

  this.options = {
    'headers': {
      'Accept': 'application/vnd.statushub.v1',
      'Content-Type': 'application/json'
    },
    'data': JSON.stringify({
      'api_key': key
    })
  };

  this.listStatusPages = function listStatusPages(perPage, page) {
    perPage = perPage || 25;
    page = page || 1;

    return rest.get(this.root + 'status_pages', merge(this.options, { 'query': { 'per_page': perPage, 'page': page } }));
  };

  this.getStatusPage = function getStatusPage(subdomain) {
    return rest.get(this.root + 'status_pages/' + subdomain, this.options);
  };

  this.listIncidents = function listIncidents(subdomain, service, perPage, page) {
    perPage = perPage || 25;
    page = page || 1;

    return rest.get(this.root + 'status_pages/' + subdomain + '/services/' + service + '/incidents', merge(this.options, { 'query': { 'per_page': perPage, 'page': page } }));
  };

  this.getIncident = function getIncident(subdomain, service, incident) {
    return rest.get(this.root + 'status_pages/' + subdomain + '/services/' + service + '/incidents/' + incident, this.options);
  };

  this.createIncident = function createIncident(subdomain, service, incident) {
    return rest.get(this.root + 'status_pages/' + subdomain + '/services/' + service + '/incidents', merge(this.options, {'data': JSON.stringify({'api_key': this.key, 'incident': incident })}));
  };

  StatusHub.Page = function Page(statusHub, subdomain) {
    this.statusHub = statusHub;
    this.subdomain = subdomain;

    this.getStatusPage = statusHub.getStatusPage.bind(statusHub, subdomain);
    this.listIncidents = statusHub.listIncidents.bind(statusHub, subdomain);

    Page.Service = function Service(page, service) {
      this.page = page;
      this.service = service;
    };
  };
};
