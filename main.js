class PulseChainApp {
    constructor() {
        this.state = {
            wallet: null,
            jwt: null,
            profile: {
                handle: '@guest',
                displayName: 'Guest',
                avatar: null,
                bio: 'Connect wallet to unlock the social graph'
            },
            feed: [],
            trending: [],
            spaces: [],
            onchain: [],
            dms: [],
            moderationQueue: [],
            uploadingMedia: null,
            mockMode: false,
            view: 'home',
            activeTopic: null
        };

        this.apiBase = '/api';
        this.feedEl = document.getElementById('feed');
        this.trendingEl = document.getElementById('trendingList');
        this.spacesEl = document.getElementById('spacesList');
        this.onchainEl = document.getElementById('onchainFeed');
        this.dmEl = document.getElementById('dmMessages');
        this.moderationEl = document.getElementById('moderationQueue');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.viewIndicatorEl = document.getElementById('viewIndicator');
        this.latencyPill = document.getElementById('latencyPill');
        this.navLinks.forEach(link => {
            if (link.dataset.section === this.state.view) {
                link.classList.add('active');
            }
        });

        this.attachListeners();
        this.bootstrap();
    }

    attachListeners() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.setView(link.dataset.section));
        });
        document.getElementById('connectWalletBtn').addEventListener('click', () => this.connectWallet());
        document.getElementById('postBtn').addEventListener('click', () => this.publishPost());
        document.getElementById('saveDraftBtn').addEventListener('click', () => this.saveDraft());
        document.getElementById('mediaInput').addEventListener('change', e => this.handleMediaUpload(e));
        document.getElementById('sendDmBtn').addEventListener('click', () => this.sendDm());
        document.getElementById('newConversationBtn').addEventListener('click', () => this.startConversation());
        document.getElementById('syncProfileBtn').addEventListener('click', () => this.syncDecentralizedProfile());
    }

    async bootstrap() {
        this.renderSkeleton();
        await this.loadInitialData();
        this.render();
        this.startLatencyPulse();
    }

    async loadInitialData() {
        try {
            const [feed, trending, spaces, onchain, moderation] = await Promise.all([
                this.api('/posts/feed'),
                this.api('/analytics/trending'),
                this.api('/spaces/live'),
                this.api('/chain/activity'),
                this.api('/moderation/queue')
            ]);

            this.state.feed = feed ?? [];
            this.state.trending = trending ?? [];
            this.state.spaces = spaces ?? [];
            this.state.onchain = onchain ?? [];
            this.state.moderationQueue = moderation ?? [];
        } catch (err) {
            console.warn('Falling back to mock data', err);
            this.state.mockMode = true;
            this.state.feed = this.getMockFeed();
            this.state.trending = this.getMockTrending();
            this.state.spaces = this.getMockSpaces();
            this.state.onchain = this.getMockOnchain();
            this.state.moderationQueue = this.getMockModeration();
            this.state.dms = this.getMockDms();
        }
    }

    async api(path, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            ...options
        };
        if (this.state.jwt) {
            config.headers.Authorization = `Bearer ${this.state.jwt}`;
        }
        const res = await fetch(`${this.apiBase}${path}`, config);
        if (!res.ok) {
            throw new Error(await res.text());
        }
        return res.status === 204 ? null : res.json();
    }

    renderSkeleton() {
        this.feedEl.innerHTML = '<div class="post-meta">Loading feed...</div>';
        this.trendingEl.innerHTML = '<div class="post-meta">Fetching trends...</div>';
        this.spacesEl.innerHTML = '<div class="post-meta">Scanning live audio rooms...</div>';
        this.onchainEl.innerHTML = '<div class="post-meta">Streaming BSC mempool...</div>';
    }

    render() {
        this.renderFeed();
        this.renderTrending();
        this.renderSpaces();
        this.renderOnchain();
        this.renderDms();
        this.renderModeration();
        this.updateIdentityBanner();
    }

    renderFeed() {
        if (this.state.view === 'notifications') {
            this.feedEl.innerHTML = '<div class="post-meta">Notifications syncing with BSC push relays...</div>';
            return;
        }
        if (this.state.view === 'dev') {
            this.feedEl.innerHTML = '<div class="post-meta">Developer console coming soon. Subscribe for API/webhook updates.</div>';
            return;
        }
        if (this.state.view === 'messages') {
            this.feedEl.innerHTML = '<div class="post-meta">DM inbox active. Scroll below to continue conversations.</div>';
            return;
        }
        if (this.state.view === 'spaces') {
            this.feedEl.innerHTML = '<div class="post-meta">Choose a live Space from the right rail to jump in.</div>';
            return;
        }
        if (this.state.view === 'moderation') {
            this.feedEl.innerHTML = '<div class="post-meta">Use the queue below to approve / remove flagged posts.</div>';
            return;
        }

        let posts = [...this.state.feed];
        if (this.state.view === 'explore') {
            posts.sort((a, b) => (b.stats?.reposts || 0) - (a.stats?.reposts || 0));
        }
        if (this.state.activeTopic) {
            posts = posts.filter(post => (post.tags || []).includes(this.state.activeTopic));
        }

        if (!posts.length) {
            this.feedEl.innerHTML = '<div class="post-meta">No posts yet. Be the first to drop alpha.</div>';
            return;
        }

        this.feedEl.innerHTML = posts.map(post => `
            <article class="post" data-post="${post._id}">
                <div class="avatar" style="background:${post.author.avatar || ''}"></div>
                <div>
                    <div class="post-header">
                        <div>
                            <strong>${post.author.displayName}</strong>
                            <span class="post-meta">${post.author.handle} • ${this.timeAgo(post.createdAt)}</span>
                        </div>
                        <button class="btn-secondary" data-follow="${post.author.handle}">
                            ${post.author.isFollowing ? 'Following' : 'Follow'}
                        </button>
                    </div>
                    <p>${this.escape(post.body)}</p>
                    ${post.media ? `<div class="post-media"><img src="${post.media}" alt="media"></div>` : ''}
                    <div class="post-actions">
                        <button class="btn-secondary" data-action="reply">💬 ${post.stats?.comments ?? 0}</button>
                        <button class="btn-secondary" data-action="repost">🔁 ${post.stats?.reposts ?? 0}</button>
                        <button class="btn-secondary" data-action="tip">🪙 Tip</button>
                        <button class="btn-secondary" data-action="report">🛡️</button>
                    </div>
                </div>
            </article>
        `).join('');

        this.feedEl.querySelectorAll('[data-follow]').forEach(btn => {
            btn.addEventListener('click', () => this.toggleFollow(btn.dataset.follow));
        });
        this.feedEl.querySelectorAll('[data-action="tip"]').forEach(btn => {
            btn.addEventListener('click', () => this.openTipModal());
        });
        this.feedEl.querySelectorAll('[data-action="report"]').forEach(btn => {
            btn.addEventListener('click', e => this.reportPost(e));
        });
    }

    renderTrending() {
        this.trendingEl.innerHTML = this.state.trending.map(topic => `
            <div class="list-tile" data-topic="${topic.tag}">
                <div style="font-weight:600;">${topic.tag}</div>
                <div class="post-meta">${topic.volume} • ${topic.sentiment}</div>
                <button class="btn-secondary open-topic">Open Stream</button>
            </div>
        `).join('');
        this.trendingEl.querySelectorAll('.open-topic').forEach(btn => {
            const tag = btn.closest('[data-topic]')?.dataset.topic;
            btn.addEventListener('click', () => this.openTopic(tag));
        });
    }

    renderSpaces() {
        this.spacesEl.innerHTML = this.state.spaces.map(space => `
            <div class="list-tile">
                <div><strong>${space.title}</strong></div>
                <div class="post-meta">${space.host} • ${space.listeners} listeners</div>
                <button class="btn-primary join-space" data-space="${space.title}" style="width:auto;padding-inline:14px;margin-top:8px;">Join</button>
            </div>
        `).join('');
        this.spacesEl.querySelectorAll('.join-space').forEach(btn => {
            btn.addEventListener('click', () => this.joinSpace(btn.dataset.space));
        });
    }

    renderOnchain() {
        this.onchainEl.innerHTML = this.state.onchain.map(tx => `
            <div class="list-tile">
                <div>${tx.title}</div>
                <div class="post-meta">${tx.hash.slice(0, 10)}... • ${tx.status}</div>
            </div>
        `).join('');
    }

    renderDms() {
        this.dmEl.innerHTML = this.state.dms.map(msg => `
            <div class="dm-bubble ${msg.from === this.state.profile.handle ? 'me' : ''}">
                <div style="font-weight:600;">${msg.from}</div>
                <div>${this.escape(msg.body)}</div>
                <div class="post-meta">${this.timeAgo(msg.createdAt)}</div>
            </div>
        `).join('');
    }

    renderModeration() {
        if (!this.state.moderationQueue.length) {
            this.moderationEl.innerHTML = '';
            return;
        }
        this.moderationEl.innerHTML = `
            <h3 style="margin-bottom:10px;">Moderation Queue</h3>
            ${this.state.moderationQueue.map(item => `
                <div class="moderation-card" data-report="${item._id}">
                    <div>
                        <div><strong>${item.author.handle}</strong> flagged for ${item.reason}</div>
                        <div class="post-meta">${item.preview}</div>
                    </div>
                    <div class="moderation-actions">
                        <button class="approve">Approve</button>
                        <button class="reject">Remove</button>
                    </div>
                </div>
            `).join('')}
        `;
        this.moderationEl.querySelectorAll('.approve').forEach(btn => {
            btn.addEventListener('click', e => this.resolveModeration(e, true));
        });
        this.moderationEl.querySelectorAll('.reject').forEach(btn => {
            btn.addEventListener('click', e => this.resolveModeration(e, false));
        });
    }

    updateIdentityBanner() {
        document.getElementById('currentUserHandle').textContent = this.state.profile.handle;
        document.getElementById('identitySummary').textContent = this.state.wallet
            ? `${this.state.wallet.slice(0, 6)}...${this.state.wallet.slice(-4)} • ${this.state.profile.displayName}`
            : 'Wallet not connected';
        const status = this.state.wallet
            ? `Connected to ${this.state.wallet.slice(0, 6)}...`
            : 'Connect wallet to post';
        document.getElementById('walletStatus').textContent = status;
    }

    setView(section) {
        this.state.view = section;
        if (section !== 'explore') {
            this.state.activeTopic = null;
        }
        this.navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === section);
        });
        const copyMap = {
            home: 'Home Feed · Real-time signal from wallets you follow',
            explore: this.state.activeTopic ? `Exploring ${this.state.activeTopic}` : 'Explore Feed · Curated by on-chain velocity',
            messages: 'Direct Messages · Encrypted inbox',
            notifications: 'Notifications · Activity across tips, follows, governance',
            spaces: 'Spaces · Token-gated audio rooms',
            moderation: 'Moderator Console · Review flagged content',
            dev: 'Developer Console · API metrics & webhooks'
        };
        if (this.viewIndicatorEl) {
            this.viewIndicatorEl.textContent = copyMap[section] || 'PulseChain Feed';
        }
        if (section === 'messages') {
            document.querySelector('.dm-pane')?.scrollIntoView({ behavior: 'smooth' });
        }
        if (section === 'moderation') {
            this.moderationEl?.scrollIntoView({ behavior: 'smooth' });
        }
        this.renderFeed();
    }

    async connectWallet() {
        if (!window.ethereum) {
            alert('Install MetaMask or a BSC compatible wallet.');
            return;
        }
        try {
            this.setWalletStatus('Connecting wallet…');
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);
            await this.ensureBscNetwork(provider);
            const signer = provider.getSigner();
            const wallet = await signer.getAddress();
            this.state.wallet = wallet;
            this.setWalletStatus('Signing challenge…');

            const challenge = await this.api('/auth/challenge', {
                method: 'POST',
                body: JSON.stringify({ wallet })
            });

            const domain = {
                name: 'PulseChain Social',
                version: '1',
                chainId: 56,
                verifyingContract: '0x0000000000000000000000000000000000000000'
            };

            const types = {
                Auth: [
                    { name: 'wallet', type: 'address' },
                    { name: 'nonce', type: 'string' },
                    { name: 'timestamp', type: 'uint256' }
                ]
            };

            const message = {
                wallet,
                nonce: challenge.nonce,
                timestamp: Math.floor(Date.now() / 1000)
            };

            let signature;
            if (provider.provider.request) {
                try {
                    signature = await provider.provider.request({
                        method: 'eth_signTypedData_v4',
                        params: [wallet, JSON.stringify({ domain, types, primaryType: 'Auth', message })]
                    });
                } catch {
                    signature = await signer.signMessage(challenge.nonce);
                }
            } else {
                signature = await signer.signMessage(challenge.nonce);
            }

            this.setWalletStatus('Verifying on server…');
            const { token, profile } = await this.api('/auth/verify', {
                method: 'POST',
                body: JSON.stringify({ wallet, signature })
            });

            this.state.jwt = token;
            this.state.profile = profile;
            this.setWalletStatus(`Connected to ${wallet.slice(0, 6)}…${wallet.slice(-4)}`);
        } catch (err) {
            console.warn('Wallet connect error', err);
            alert('Unable to connect wallet. Running in guest mode.');
            if (this.state.wallet) {
                this.state.profile = {
                    handle: '@' + this.state.wallet.slice(2, 6),
                    displayName: 'Anon Builder',
                    avatar: null
                };
            }
        }

        this.render();
    }

    setWalletStatus(message) {
        const statusEl = document.getElementById('walletStatus');
        if (statusEl) statusEl.textContent = message;
    }

    async ensureBscNetwork(provider) {
        const network = await provider.getNetwork();
        if (network.chainId === 56) return;
        try {
            await provider.send('wallet_switchEthereumChain', [{ chainId: '0x38' }]);
        } catch (err) {
            if (err.code === 4902) {
                await provider.send('wallet_addEthereumChain', [{
                    chainId: '0x38',
                    chainName: 'Binance Smart Chain',
                    nativeCurrency: {
                        name: 'BNB',
                        symbol: 'BNB',
                        decimals: 18
                    },
                    rpcUrls: ['https://bsc-dataseed.binance.org/'],
                    blockExplorerUrls: ['https://bscscan.com/']
                }]);
            } else {
                throw err;
            }
        }
    }

    async publishPost() {
        const body = document.getElementById('composerInput').value.trim();
        if (!body) return;

        const payload = {
            body,
            media: this.state.uploadingMedia,
            visibility: 'public'
        };

        try {
            const post = await this.api('/posts', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            this.state.feed = [post, ...this.state.feed];
        } catch (err) {
            console.warn('Posting offline, storing locally', err);
            this.state.feed = [{
                _id: crypto.randomUUID(),
                body,
                media: this.state.uploadingMedia,
                createdAt: new Date().toISOString(),
                author: this.state.profile,
                stats: { comments: 0, reposts: 0, tips: 0 }
            }, ...this.state.feed];
            localStorage.setItem('pulsechain_feed', JSON.stringify(this.state.feed));
        }

        document.getElementById('composerInput').value = '';
        this.state.uploadingMedia = null;
        this.renderFeed();
    }

    async toggleFollow(handle) {
        try {
            await this.api(`/social/follow/${handle}`, { method: 'POST' });
        } catch (err) {
            console.warn('Follow fallback', err);
        }
        this.state.feed = this.state.feed.map(post => {
            if (post.author.handle === handle) {
                post.author.isFollowing = !post.author.isFollowing;
            }
            return post;
        });
        this.renderFeed();
    }

    async sendDm() {
        const input = document.getElementById('dmInput');
        const text = input.value.trim();
        if (!text) return;

        const message = {
            _id: crypto.randomUUID(),
            from: this.state.profile.handle,
            body: text,
            createdAt: new Date().toISOString()
        };

        try {
            await this.api('/dm/send', {
                method: 'POST',
                body: JSON.stringify({ to: '@pulse', body: text })
            });
        } catch (err) {
            console.warn('DM offline mode', err);
        }

        this.state.dms.push(message);
        input.value = '';
        this.renderDms();
    }

    async reportPost(event) {
        const postEl = event.target.closest('.post');
        const postId = postEl?.dataset.post;
        if (!postId) return;
        try {
            await this.api(`/moderation/report/${postId}`, { method: 'POST' });
            alert('Post reported to the DAO moderators.');
        } catch {
            alert('Report stored locally (offline).');
        }
    }

    async resolveModeration(event, approve) {
        const card = event.target.closest('.moderation-card');
        const id = card?.dataset.report;
        if (!id) return;
        try {
            await this.api(`/moderation/resolve/${id}`, {
                method: 'POST',
                body: JSON.stringify({ approve })
            });
        } catch (err) {
            console.warn('Moderation fallback', err);
        }
        this.state.moderationQueue = this.state.moderationQueue.filter(item => item._id !== id);
        this.renderModeration();
    }

    async handleMediaUpload(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            this.state.uploadingMedia = reader.result;
        };
        reader.readAsDataURL(file);
        try {
            await this.api('/media/upload', {
                method: 'POST',
                body: JSON.stringify({ contentType: file.type })
            });
        } catch (err) {
            console.warn('Media upload fallback', err);
        }
    }

    async syncDecentralizedProfile() {
        alert('ENS / Lens sync queued. This would pull metadata from decentralized identity sources in production.');
    }

    startConversation() {
        const handle = prompt('Start DM with which handle?');
        if (!handle) return;
        this.state.dms.push({
            _id: crypto.randomUUID(),
            from: handle,
            body: 'GM fren! Welcome to PulseChain.',
            createdAt: new Date().toISOString()
        });
        this.renderDms();
    }

    openTipModal() {
        alert('Tip jar coming soon: streaming native BNB + ERC20 tipping and NFT rewards.');
    }

    saveDraft() {
        const body = document.getElementById('composerInput').value;
        localStorage.setItem('pulsechain_draft', body);
        alert('Draft saved locally.');
    }

    startLatencyPulse() {
        if (!this.latencyPill) return;
        const tick = () => {
            const latency = Math.floor(Math.random() * 80) + 20;
            this.latencyPill.textContent = `Live · ${latency}ms`;
        };
        tick();
        setInterval(tick, 5000);
    }

    openTopic(tag) {
        this.state.activeTopic = tag;
        this.setView('explore');
    }

    joinSpace(spaceTitle) {
        alert(`Requesting access to ${spaceTitle}. Token gating will run on-chain in production.`);
        this.setView('spaces');
    }

    getMockFeed() {
        return [
            {
                _id: '1',
                body: 'Web3 social graph on BSC launching now. Tip creators using BEP-20 tokens instantly.',
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                author: { displayName: 'Pulse Labs', handle: '@pulse', isFollowing: true },
                tags: ['#PulseChain', '#DeSoc'],
                stats: { comments: 24, reposts: 12, tips: 4 }
            },
            {
                _id: '2',
                body: 'Dropping a gated audio Space for NFT holders tonight, reply with 🔥 to get an invite.',
                media: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
                createdAt: new Date(Date.now() - 7200000).toISOString(),
                author: { displayName: 'Builder DAO', handle: '@build', isFollowing: false },
                tags: ['#BNBTip'],
                stats: { comments: 102, reposts: 41, tips: 19 }
            }
        ];
    }

    getMockTrending() {
        return [
            { tag: '#PulseChain', volume: '34k', sentiment: 'Bullish' },
            { tag: '#BNBTip', volume: '12k', sentiment: 'Neutral' },
            { tag: '#DeSoc', volume: '8k', sentiment: 'Rising' }
        ];
    }

    getMockSpaces() {
        return [
            { title: 'Funding public goods on BSC', host: '@bigbrain', listeners: 324 },
            { title: 'NFT music rights AMA', host: '@soundwave', listeners: 191 }
        ];
    }

    getMockOnchain() {
        return [
            { title: 'New creator staking pool deployed', hash: '0xabcd1234ff', status: 'Success' },
            { title: 'Pulse governance vote #12 started', hash: '0x9887cdefaa', status: 'Pending' }
        ];
    }

    getMockModeration() {
        return [
            { _id: 'flag1', author: { handle: '@anon' }, reason: 'Spam', preview: 'Win 10 BNB if...' }
        ];
    }

    getMockDms() {
        return [
            { _id: 'dm1', from: '@pulse', body: 'Welcome to the beta!', createdAt: new Date(Date.now() - 600000).toISOString() }
        ];
    }

    timeAgo(timestamp) {
        const diff = Date.now() - new Date(timestamp).getTime();
        if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return dayjs(timestamp).format('MMM D');
    }

    escape(str) {
        return str.replace(/[&<>"']/g, c => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;'
        }[c]));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.pulseChainApp = new PulseChainApp();
});
