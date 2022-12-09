import { fileURLToPath } from 'url';
import { publish } from 'gh-pages';
import { join, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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