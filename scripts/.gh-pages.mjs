import { publish } from 'gh-pages';
import { join } from 'path';

publish(join(__dirname, '../www'), {
    repo: 'https://github.com/sumbad/view-graph.git',
    branch: 'gh-pages',
    user: {
        name: 'sumbad',
        email: 'sumbad@ya.ru'
    }
}, function (err) {
    console.log(err || 'END DEPLOY SUCCESS')
});