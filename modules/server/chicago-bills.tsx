import axios from 'axios';
import cheerio from 'cheerio';
import { ChicagoBills } from '../entities/bills';

export const getChicagoBills = async (): Promise<ChicagoBills[]> => {
  const results = await axios.get(
    'https://chicago.councilmatic.org/search/?selected_facets=topics_exact%3ANon-Routine&selected_facets=inferred_status_exact%3AActive&selected_facets=bill_type_exact%3Aresolution&page=1'
  );

  const $ = cheerio.load(results.data);
  const legislationsHtml = $('.order-nav')
    .html()
    .split('<!-- Legislation result -->');
  legislationsHtml.shift(); // remove first element that contains no data

  const legislationsJson = legislationsHtml.map((legislationHtml) => {
    const _$ = cheerio.load(legislationHtml);
    return {
      status: _$('span.label').text().trim(),
      date: _$('i.fa-calendar-o').parent().text().trim(),
      sponsor: _$('i.fa-user').parent().text().trim(),
      link: `https://chicago.councilmatic.org${_$('a.small')
        .attr('href')
        .trim()}`,
      id: _$('a.small').text().trim(),
      title: _$('.row .col-xs-11 p').text().trim(),
      tags: _$('i.fa-tag')
        .parent()
        .find('.badge')
        .map(function () {
          return _$(this).text().trim();
        })
        .toArray(),
    };
  });
  return legislationsJson;
};
