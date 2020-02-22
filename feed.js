/**
 * Copyrightⓒ2020 by Moon Hanju (github.com/it-crafts)
 * All rights reserved. 무단전재 및 재배포 금지.
 * All contents cannot be copied without permission.
 */
const common = (() => {
    const IMG_PATH = 'https://it-crafts.github.io/lesson/img';
    const fetchApiData = async (url, page = 'info') => {
        const res = await fetch(url + page);
        const data = await res.json();
        return data.data;
    }

    return { IMG_PATH, fetchApiData }
})();

const Root = (selector) => {
    let $el;
    let $page;

    const create = () => {
        // selector, $el = main
        $el = document.querySelector(selector); //main (>div(v9tJq) (userinfo(div) + 탭(fx7hk) + 타임라인(_2z6nI) ))
        $page = Timeline($el);
        $page.create();
    }

    const destroy = () => {
        $page && $page.destroy();
    }

    return { $el, create, destroy }
};

const Timeline = ($parent) => { //$parent = main
    const URL = 'https://my-json-server.typicode.com/it-crafts/lesson/timeline/';
    let $el;
    let $profile;
    let $content;

    const create = async () => {
        render();
        $el = $parent.firstElementChild;
        const [ totalPage, profileData ] = await fetch();
        //부모 컴포넌트 내부에서 자식 컴포넌트 생성 (컴포넌트간 결합 발생)
        $profile = TimelineProfile($el, profileData);
        $profile.create();
        $content = TimelineContent($el, URL, profileData, totalPage);
        $content.create();
    }

    const destroy = () => {
        $profile && $profile.destroy();
        $content && $content.destroy();
        $parent.removeChild($el);
    }

    const fetch = async () => {
        const infoData = await common.fetchApiData(URL);
        const totalPage = infoData.totalPage * 1;
        const profileData = infoData.profile;
        return [ totalPage, profileData ];
    }

    const render = () => {
        $parent.innerHTML = `
            <div class="v9tJq">
                <div class="fx7hk">
                    <a class="_9VEo1 T-jvg" href="javascript:;" data-type="grid"><span aria-label="게시물" class="glyphsSpritePhoto_grid__outline__24__grey_5 u-__7"></span></a>
                    <a class="_9VEo1" href="javascript:;" data-type="feed"><span aria-label="피드" class="glyphsSpritePhoto_list__outline__24__blue_5 u-__7"></span></a>
                    <a class="_9VEo1" href="javascript:;" data-type=""><span aria-label="태그됨" class="glyphsSpriteTag_up__outline__24__grey_5 u-__7"></span></a>
                </div>
            </div>
        `;
    }

    return { $el, create, destroy }
};

const TimelineProfile = ($parent, profileData = {}) => {
    let $el;

    const create = () => {
        render(profileData);
        $el = $parent.firstElementChild;
    }

    const destroy = () => {
        $parent.removeChild($el);
    }

    const scaleDown = numstring => {
        const num = numstring.replace(/,/g, '');
        if(num >= 1000000) {
            return Math.floor(num / 100000) / 10 + '백만'
        }
        if(num >= 1000) {
            return Math.floor(num / 100) / 10 + '천'
        }
        return num;
    };

    const render = (data) => {
        $parent.insertAdjacentHTML('afterbegin', `
            <div>
                <header class="HVbuG">
                    <div class="XjzKX">
                        <div class="RR-M- h5uC0" role="button" tabindex="0">
                            <canvas class="CfWVH" height="91" width="91" style="position: absolute; top: -7px; left: -7px; width: 91px; height: 91px;"></canvas>
                            <span class="_2dbep" role="link" tabindex="0" style="width: 77px; height: 77px;"><img alt="${data.name}님의 프로필 사진" class="_6q-tv" src="${common.IMG_PATH}${data.img}"></span>
                        </div>
                    </div>
                    <section class="zwlfE">
                        <div class="nZSzR">
                            <h1 class="_7UhW9 fKFbl yUEEX KV-D4 fDxYl">${data.name}</h1>
                            <span class="mrEK_ Szr5J coreSpriteVerifiedBadge" title="인증됨">인증됨</span>
                            <div class="AFWDX"><button class="dCJp8 afkep"><span aria-label="옵션" class="glyphsSpriteMore_horizontal__outline__24__grey_9 u-__7"></span></button></div>
                        </div>
                        <div class="Y2E37">
                            <div class="Igw0E IwRSH eGOV_ vwCYk">
                                <span class="ffKix bqE32">
                                    <span class="vBF20 _1OSdk"><button class="_5f5mN jIbKX _6VtSN yZn4P">팔로우</button></span>
                                    <span class="mLCHD _1OSdk"><button class="_5f5mN jIbKX KUBKM yZn4P"><div class="OfoBO"><div class="_5fEvj coreSpriteDropdownArrowWhite"></div></div></button></span>
                                </span>
                            </div>
                        </div>
                    </section>
                </header>
                <div class="-vDIg">
                    <h1 class="rhpdm">${data.title}</h1><br><span>${data.text}</span>
                </div>
                <ul class="_3dEHb">
                    <li class="LH36I"><span class="_81NM2">게시물 <span class="g47SY lOXF2">${data.post}</span></span></li>
                    <li class="LH36I"><a class="_81NM2" href="javascript:;">팔로워 <span class="g47SY lOXF2" title="${data.follower}">${scaleDown(data.follower)}</span></a></li>
                    <li class="LH36I"><a class="_81NM2" href="javascript:;">팔로우 <span class="g47SY lOXF2">${data.follow}</span></a></li>
                </ul>
            </div>
        `);
    }

    return { $el, create, destroy }
};

//$content = TimelineContent($el(v9tJq), URL, profileData, totalPage);
const TimelineContent = ($parent, url = '', profileData = {}, totalPage = 1) => {
    let $el;
    let $feed;

    let page = 0;
    const dataList = [];

    const create = async () => {
        render();
        $el = $parent.lastElementChild; //v9tJq, fx7hk(탭)
        const pageDataList = await fetch();
        $feed = Feed($el.firstElementChild, profileData, pageDataList);
        $feed.create();
        initInfiniteScroll();
    }

    const destroy = () => {
        $feed && $feed.destroy();
        $parent.removeChild($el);
    }

    const fetch = async () => {
        const pageDataList = await common.fetchApiData(url, ++page);
        dataList.push(pageDataList);
        return pageDataList;
    }

    const initInfiniteScroll = () => {
        const $loading = $el.lastElementChild;
        const io = new IntersectionObserver((entryList, observer) => {
            entryList.forEach(async entry => {
                if(!entry.isIntersecting) { return; }
                await ajaxMore();
                if(page >= totalPage) {
                    observer.unobserve(entry.target);
                    $loading.style.display = 'none';
                }
            });
        }, { rootMargin: innerHeight + 'px' });
        io.observe($loading);
    }

    const ajaxMore = async () => {
        const pageDataList = await fetch();
        $feed && $feed.addFeedItems(profileData, pageDataList);
    }

    const render = () => {
        $parent.insertAdjacentHTML('beforeend', `
            <div class="_2z6nI">
                <div style="flex-direction: column;">
                </div>
                <div class="_4emnV">
                    <div class="Igw0E IwRSH YBx95 _4EzTm _9qQ0O ZUqME" style="height: 32px; width: 32px;"><svg aria-label="읽어들이는 중..." class="By4nA" viewBox="0 0 100 100"><rect fill="#555555" height="6" opacity="0" rx="3" ry="3" transform="rotate(-90 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.08333333333333333" rx="3" ry="3" transform="rotate(-60 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.16666666666666666" rx="3" ry="3" transform="rotate(-30 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.25" rx="3" ry="3" transform="rotate(0 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.3333333333333333" rx="3" ry="3" transform="rotate(30 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.4166666666666667" rx="3" ry="3" transform="rotate(60 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.5" rx="3" ry="3" transform="rotate(90 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.5833333333333334" rx="3" ry="3" transform="rotate(120 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.6666666666666666" rx="3" ry="3" transform="rotate(150 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.75" rx="3" ry="3" transform="rotate(180 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.8333333333333334" rx="3" ry="3" transform="rotate(210 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.9166666666666666" rx="3" ry="3" transform="rotate(240 50 50)" width="25" x="72" y="47"></rect></svg></div>
                </div>
            </div>
        `);
    }

    return { $el, create, destroy }
};

// TODO 뷰 역할인 Feed 컴포넌트에 이미지 레이지로드 기능 추가 - initInfiniteScroll 히스토리 참고
const Feed = ($parent, profileData = {}, pageDataList = []) => {
    const $elList = [];
    let io;

    const create = () => {
        /* TODO 지금은 옵저버 객체는 하나만 있으면 충분할 것 같습니다
        Feed의 부하 객체이며, 보라고 한 엘리먼트 들을 바라보고 있다가 보이면 시킨일(콜백)을 합니다
        option 객체는 뗄 때 이득이 별로 없어서 없앴는데, 요건 개인의 취향대로 하세요 */
        io = new IntersectionObserver(lazyLoadImage, {
            /* COMMENT 마진을 위해 엘리먼트의 clientHeight를 계속 호출하면 그 때 마다 계속 리플로우가 트리거됩니다
            여기서는 부모 엘리먼트의 가로가 곧 이미지의 세로이므로, 생성시에 그 사이즈를 빌려쓰면 좋을 것 같습니다
            참고로, 모바일 가로/세로 전환시나 창크기 변경시 마진값 업데이트가 필요하나, 큰 이슈는 없을 것 같습니다 */
            rootMargin: $parent.clientWidth + 'px 0px'
        });
        addFeedItems(profileData, pageDataList); //12개씩
    }

    const destroy = () => {
        $elList.forEach($el => $parent.removeChild($el));
    }

    const addFeedItems = (profileData = {}, pageDataList = []) => {
        const firstIndex = $parent.children.length;
        render(profileData, pageDataList);
        // call(): 인수목록(arg array)을 받는다. = $parent.children
        // Array.prototype.slice.call = [].slice.call
        $elList.push(...[].slice.call($parent.children, firstIndex)); //리스트얕은복사. 12개아이템, 0
        observeLazyImgs();
    }

    const observeLazyImgs = () => {
        /* FIXME 부모 컴포넌트에서 Feed 이외에 다른 컴포넌트도 모두 룩업대상이 됩니다
        선택자가 특이해서 잘 발생하지 않을 케이스라 문제가 될 경우는 많지 않겠지만
        여기서는 추가한 엘리먼트를 돌면서 뽑는 게 좋을 것 같습니다 (속도도 이 쪽이 더 빠릅니다) */
        /* BUG 매 번 전체 대상의 [data-src]를 긁고 있기 때문에,
        2페이지, 3페이지, ... addFeedItems 호출 시에 이전페이지 이미지들이 다시 옵저버에 등록됩니다
        추가한 엘리먼트에서 뽑는 방법이 있을 것 같습니다 (push 하기 전에 미리 뽑아두고?)
        일단 지금은 data 속성 자체를 없애도록 방어처리만 해두었습니다 */
        const $imgs = $parent.querySelectorAll('[data-src]');
        $imgs.forEach($img => io.observe($img)); // 옵저버한테 바라볼 이미지들을 추가로 알려줌
    }

    const lazyLoadImage = (entryList, observer) => {
        entryList.forEach(async entry => {
            /* TODO 분기가 필요한 케이스라면 두 가지 패턴을 기준으로 생각하세요
            1) 특정한 상태를 감시하고 있다가 로직을 return으로 튕겨내는 예외로직
            2) 특정한 상태에만 수행되는 예외로직 (빼도 위아래 로직에 영향이 없는)
            위아래 로직과 결합이 있다면 그건 예외로직이 아니라 메인로직 입니다
            또는 함수형으로 사고한다면 위의 1)과 2)를 아예 반대로 짤 수도 있습니다
            반대로 메인로직을 케이스에 넣는 형태로.. 어느 쪽으로 가든 구조는 맞춰주세요 */
            if(!entry.isIntersecting) {
                return; // 로직을 실행하지 않을 케이스를 미리 튕겨낸다 (이제 아래로직을 짤 때는 여기를 고려할 필요 없음)
            }
            
            const { target } = entry;
            target.src = target.dataset.src;
            delete target.dataset.src;
            io.unobserve(target); // 할 일 끝냈니까 이 이미지는 바라보기 종료
        });
    }

    const render = (profileData, pageDataList) => {
        const html = pageDataList.reduce((html, data) => {
            html += `
                <article class="M9sTE h0YNM SgTZ1">
                    <header class="Ppjfr UE9AK wdOqh">
                        <div class="RR-M- h5uC0 mrq0Z" role="button" tabindex="0">
                            <canvas class="CfWVH" height="126" width="126" style="position: absolute; top: -5px; left: -5px; width: 42px; height: 42px;"></canvas>
                            <span class="_2dbep" role="link" tabindex="0" style="width: 32px; height: 32px;"><img alt="${profileData.name}님의 프로필 사진" class="_6q-tv" src="${common.IMG_PATH}${profileData.img}"></span>
                        </div>
                        <div class="o-MQd">
                            <div class="e1e1d">
                                <h2 class="BrX75"><a class="FPmhX notranslate nJAzx" title="${profileData.name}" href="javascript:;">${profileData.name}</a></h2>
                            </div>
                        </div>
                    </header>
                    <div class="_97aPb">
                        <div role="button" tabindex="0" class="ZyFrc">
                            <div class="eLAPa kPFhm">
                                <div class="KL4Bh" style="padding-bottom: 100%;"><img class="FFVAD" alt="${data.name}" src="${common.IMG_PATH}/lazy${data.img}" data-src="${common.IMG_PATH}${data.img}" style="object-fit: cover;"></div>
                                <div class="_9AhH0"></div>
                            </div>
                        </div>
                    </div>
                    <div class="eo2As">
                        <section class="ltpMr Slqrh">
                            <span class="fr66n"><button class="dCJp8 afkep"><span aria-label="좋아요" class="glyphsSpriteHeart__outline__24__grey_9 u-__7"></span></button></span>
                            <span class="_15y0l"><button class="dCJp8 afkep"><span aria-label="댓글 달기" class="glyphsSpriteComment__outline__24__grey_9 u-__7"></span></button></span>
                            <span class="_5e4p"><button class="dCJp8 afkep"><span aria-label="게시물 공유" class="glyphsSpriteDirect__outline__24__grey_9 u-__7"></span></button></span>
                            <span class="wmtNn"><button class="dCJp8 afkep"><span aria-label="저장" class="glyphsSpriteSave__outline__24__grey_9 u-__7"></span></button></span>
                        </section>
                        <section class="EDfFK ygqzn">
                            <div class=" Igw0E IwRSH eGOV_ ybXk5 vwCYk">
                                <div class="Nm9Fw"><a class="zV_Nj" href="javascript:;">좋아요 <span>${data.clipCount}</span>개</a></div>
                            </div>
                        </section>
                        <div class="KlCQn EtaWk">
                            <ul class="k59kT">
                                <div role="button" class="ZyFrc">
                                    <li class="gElp9" role="menuitem">
                                        <div class="P9YgZ">
                                            <div class="C7I1f X7jCj">
                                                <div class="C4VMK">
                                                    <h2 class="_6lAjh"><a class="FPmhX notranslate TlrDj" title="${profileData.name}" href="javascript:;">${profileData.name}</a></h2>
                                                    <span>${data.text}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </div>
                                <li class="lnrre">
                                    <button class="Z4IfV sqdOP yWX7d y3zKF" type="button">댓글 <span>${data.commentCount}</span>개 모두 보기</button>
                                </li>
                            </ul>
                        </div>
                        <section class="sH9wk _JgwE eJg28">
                            <div class="RxpZH"></div>
                        </section>
                    </div>
                    <div class="MEAGs">
                        <button class="dCJp8 afkep"><span aria-label="옵션 더 보기" class="glyphsSpriteMore_horizontal__outline__24__grey_9 u-__7"></span></button>
                    </div>
                </article>
            `;
            return html;
        }, '');
        $parent.insertAdjacentHTML('beforeend', html);
    }

    return { $elList, create, destroy, addFeedItems }
};

const root = Root('main');
root.create();
// root.destroy();
// root.create();