(function () {
    const search = document.getElementById('glossSearch');
    const count = document.getElementById('glossCount');
    const main = document.getElementById('glossMain');
    const noResults = document.getElementById('noResults');
    if (!search || !main) return;

    const pills = Array.from(document.querySelectorAll('.gloss-pill'));
    const groups = Array.from(main.querySelectorAll('.letter-group'));
    const terms = Array.from(main.querySelectorAll('.term-card'));
    const jumpLinks = [];
    let activeCategory = 'all';

    function buildLetterLinks(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.replaceChildren();
        groups.forEach(group => {
            const heading = group.querySelector('.letter-heading');
            if (!heading) return;
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent.trim();
            link.setAttribute('aria-label', `Jump to ${heading.textContent.trim()}`);
            container.appendChild(link);
            jumpLinks.push({ link, group });
        });
    }

    function filterTerms() {
        const query = search.value.trim().toLowerCase();
        let visibleCount = 0;
        terms.forEach(term => {
            const categoryMatches = activeCategory === 'all' || term.dataset.cat === activeCategory;
            const searchableText = [
                term.querySelector('.term-name')?.textContent,
                term.querySelector('.term-def')?.textContent,
                term.querySelector('.term-usage')?.textContent
            ].join(' ').toLowerCase();
            const visible = categoryMatches && (!query || searchableText.includes(query));
            term.classList.toggle('hidden', !visible);
            if (visible) visibleCount++;
        });

        groups.forEach(group => {
            group.classList.toggle('hidden', !group.querySelector('.term-card:not(.hidden)'));
        });
        jumpLinks.forEach(({ link, group }) => {
            const available = !group.classList.contains('hidden');
            link.classList.toggle('has-terms', available);
            link.setAttribute('aria-disabled', String(!available));
            link.tabIndex = available ? 0 : -1;
        });
        if (count) count.textContent = `${visibleCount} term${visibleCount === 1 ? '' : 's'}`;
        if (noResults) noResults.style.display = visibleCount ? 'none' : 'block';
    }

    pills.forEach(pill => pill.addEventListener('click', () => {
        pills.forEach(item => item.classList.toggle('active', item === pill));
        activeCategory = pill.dataset.cat || 'all';
        filterTerms();
    }));
    search.addEventListener('input', filterTerms);
    search.addEventListener('search', filterTerms);

    buildLetterLinks('alphaJump');
    buildLetterLinks('glossSidebar');
    filterTerms();
})();