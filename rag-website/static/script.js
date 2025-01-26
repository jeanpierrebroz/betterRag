document.addEventListener('DOMContentLoaded', (event) => {
    const uploadForm = document.getElementById('upload-form');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');
    const indexButton = document.getElementById('index-button');
    const status = document.getElementById('status');
    const queryLink = document.getElementById('query-link');
    const queryForm = document.getElementById('query-form');
    const queryInput = document.getElementById('query-input');
    const answer = document.getElementById('answer');

    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const files = fileInput.files;
            for (let file of files) {
                const formData = new FormData();
                formData.append('file', file);
                try {
                    const response = await fetch('/upload', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();
                    fileList.innerHTML += `<p>${file.name} - ${result.message}</p>`;
                } catch (error) {
                    console.error('Error:', error);
                }
            }
            indexButton.disabled = false;
        });

        indexButton.addEventListener('click', async () => {
            try {
                status.textContent = 'Indexing documents...';
                const response = await fetch('/index', { method: 'POST' });
                const result = await response.json();
                status.textContent = result.message;
                queryLink.style.display = 'inline-block';
            } catch (error) {
                console.error('Error:', error);
                status.textContent = 'Error indexing documents';
            }
        });
    }

    if (queryForm) {
        queryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const question = queryInput.value;
            try {
                const response = await fetch('/query', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ question: question }),
                });
                const result = await response.json();
                answer.textContent = result.answer;
            } catch (error) {
                console.error('Error:', error);
                answer.textContent = 'Error querying documents';
            }
        });
    }
});

