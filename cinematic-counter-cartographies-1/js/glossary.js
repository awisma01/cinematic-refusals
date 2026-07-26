document.addEventListener('DOMContentLoaded', function() {
    const glossSearch = document.getElementById('glossSearch');
    const glossCount = document.getElementById('glossCount');
    const glossMain = document.getElementById('glossMain');
    const noResults = document.getElementById('noResults');
    const glossPills = document.querySelectorAll('.gloss-pill');
    const letterGroups = document.querySelectorAll('.letter-group');

    // Function to filter terms based on search input
    function filterTerms() {
        const searchTerm = glossSearch.value.toLowerCase();
        let visibleCount = 0;

        letterGroups.forEach(group => {
            const terms = group.querySelectorAll('.term-card');
            let groupVisible = false;

            terms.forEach(term => {
                const termName = term.querySelector('.term-name').textContent.toLowerCase();
                if (termName.includes(searchTerm)) {
                    term.classList.remove('hidden');
                    groupVisible = true;
                    visibleCount++;
                } else {
                    term.classList.add('hidden');
                }
            });

            group.classList.toggle('hidden', !groupVisible);
        });

        glossCount.textContent = `${visibleCount} term${visibleCount !== 1 ? 's' : ''} found`;
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    // Event listener for search input
    glossSearch.addEventListener('input', filterTerms);

    // Function to filter terms by category
    glossPills.forEach(pill => {
        pill.addEventListener('click', function() {
            glossPills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-cat');
            letterGroups.forEach(group => {
                const terms = group.querySelectorAll('.term-card');
                let groupVisible = false;

                terms.forEach(term => {
                    const termCategory = term.getAttribute('data-cat');
                    if (category === 'all' || termCategory === category) {
                        term.classList.remove('hidden');
                        groupVisible = true;
                    } else {
                        term.classList.add('hidden');
                    }
                });

                group.classList.toggle('hidden', !groupVisible);
            });

            filterTerms(); // Reapply search filter after category change
        });
    });
});