/**
 * Copyrightⓒ2020 by Moon Hanju (github.com/it-crafts)
 * All rights reserved. 무단전재 및 재배포 금지.
 * All contents cannot be copied without permission.
 */
(async () => {

// 유틸리티성 객체 - 모든 객체에서 사용하는 공통속성, 공통메소드 보유 (경리사원)
const common = (() => {
    const IMG_PATH = 'https://it-crafts.github.io/lesson/img';
    const fetchApiData = async (url, page = 'info') => {
        const res = await fetch(url + page);
        const data = await res.json();
        return data.data;
    }
    
    return { IMG_PATH, fetchApiData }
})();

// 루트 객체 - 본 SPA의 모든 하위객체에 최초의 명령을 내리는 주체 (본부장)
const root = (() => {
    let $el;

    const create = () => {
        $el = document.querySelector('main');
    }

    create();
    return { $el } //외부로 통신할 객체만 오픈해줌
})();

// 페이지 객체 - 요청된 URL PATH의 최상위객체, 라우팅의 주체 (팀장)
const timeline = await (async($parent) => {
    // console.log(root) //main
    // console.log(root.$el) //main
    // console.log($parent) //main
    // [질문1] root, $el, root.$el 이 다 같은 엘리먼트를 가리키는데, 변수명이 다 다른 이유는 무엇때문인가요? 잘 이해가 안되서 질문드립니다.
    /* COMMENT root는 루트 컴포넌트를 보고, root.$el이 루트 컴포넌트의 엘리먼트를 봅니다
    그리고 여기서는 $parent에 root.$el을 꽂았기 때문에 얘도 루트 엘리먼트를 봅니다
    root나 root.$el는 timeline 내부에서는 접근되어서는 안 됩니다
    여기서는 $parent에만 접근 가능하고, 부모 엘리먼트로 추상화하여 사고합니다 */
    let $el;
    const url = 'https://my-json-server.typicode.com/it-crafts/lesson/timeline/';
    const infoData = await common.fetchApiData(url);
    const totalPage = infoData.totalPage * 1;
    const profileData = infoData.profile;

    const create = () => {
        render();
        $el = $parent.firstElementChild;
    }

    // render는 순수한 뷰 컴포넌트
    const render = () => {
        $parent.innerHTML = `
            <div class="v9tJq">
                <div class="fx7hk">
                    <a class="_9VEo1 T-jvg" href="javascript:;" data-type="grid"><span aria-label="게시물" class="glyphsSpritePhoto_grid__outline__24__grey_5 u-__7"></span></a>
                    <a class="_9VEo1" href="javascript:;" data-type="feed"><span aria-label="피드" class="glyphsSpritePhoto_list__outline__24__grey_5 u-__7"></span></a>
                    <a class="_9VEo1" href="javascript:;" data-type=""><span aria-label="태그됨" class="glyphsSpriteTag_up__outline__24__blue_5 u-__7"></span></a>
                </div>
            </div>
        `;
    }

    create();
    return { $el, totalPage, profileData, url }
})(root.$el);

// 페이지 객체의 하위섹션 객체, 여기서는 헤더영역 담당 (파트장1)
const timelineProfile = (($parent, profileData) => {
    let $el;

    const create = () => {
        render(profileData);
        $el = $parent.firstElementChild;
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

    /* XXX 71줄, 89줄
     *  render함수는 프로필 데이터를 위해서만 사용되는 함수니까 const render = (data) => / render(profileData); 대신 
     *  const render = (profileData) => / render(); 이렇게 써도 되나요?
     */
    /* COMMENT 안 됩니다. 일단 그렇게 바꾸면 정상적으로 작동하지 않구요 (파라미터는 선언 되었는데, 아규먼트가 안 꽂혔으니)
    render는 한 번 쓰고 끝나는 메소드가 아니라, 데이터 업데이트 시에 재사용하는 메소드입니다
    계속 profileData를 기반으로 렌더한다는 보장이 없으며, 다른 데이터를 꽂아도 로직을 재사용 할 수 있어야 합니다
    모든 함수는 되도록 순수함수로 작성되는 편이 바람직합니다 */
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

    create();
    return { $el }
})(timeline.$el, timeline.profileData);

// 페이지 객체의 하위섹션 객체, 여기서는 콘텐츠영역 담당 (파트장2)
const timelineContent = (($parent) => {
    let $el;

    const create = () => {
        render();
        $el = $parent.lastElementChild;
    }

    const render = () => {
        $parent.insertAdjacentHTML('beforeend', `
            <div class="_2z6nI">
                <div style="flex-direction: column;">
                </div>
            </div>
        `);
    }

    create();
    return { $el }
})(timeline.$el);

// 컨트롤러 컴포넌트 역할
const grid = await (async ($parent, url) => {
    let $el;
    let $btnLatest, $btnPopular, $inputSearch;

    let page = 1;
    const ITEM_PER_ROW = 3;
    const timelineList = await common.fetchApiData(url, page++);

    // article ~ grid 외 엘리먼트 렌더링. $el = article
    const create = () => {
        render();
        $el = $parent.lastElementChild;

        /** [질문1] <main> 같은 엘리먼트나 버튼 등을 클래스(querySelector)나 아이디(getElementById)로 선택하지 않고, 컨텍스트 기반의 엘리먼트 선택 메서드를 사용하시는 이유가 있나요?
        * 성능적인 측면에서 더 우수한가요?
        */ 
        /* COMMENT 나열된 방법 모두 바람직한 방법은 아닙니다
        컴포넌트 내부에서 특정한 자식 엘리먼트를 잡기위해 태그 자체에 id나 class를 따로 선언해놓고 룩업하는 것도 바람직하지 못하고 (템플릿과 JS객체 간에 커플링이 생기므로)
        지금과 같이 상대적인 위치로 뽑는 것도 절대 바람직하지 않습니다 (로직 내부에서 템플릿에 하위 컴포넌트나 커스텀 엘리먼트를 꽂으면 틀어지므로)
        커리큘럼 중반부에 바람직한 구조가 잡히기 전까지 임시로 사용하고 있을 뿐입니다 */
        /* [질문2] 여기서 $parent 또는 $el 로 getElementById('btn_latest'); 를 하면 $parent.getElementById is not a function 에러가 뜨는지 모르겠습니다.
        */
        /* COMMENT 엘리먼트 객체에는 원래 getElementById API가 없습니다
        ID는 한 문서에 유니크한 게 원래대로면 맞기 때문에 그렇습니다
        물론 그렇다고 한 문서에 ID가 유니크하다는 얘기는 아닙니다 (보통 ID는 빈번하게 중복됩니다) */
        $btnLatest = document.getElementById('btn_latest');
        $btnPopular = document.getElementById('btn_popular');
        $inputSearch = document.querySelector('.input_search');
    }
    
    // 클로져로 묶인 지역함수(캡슐화)
    const divide = (list, size) => {
        console.log(size)
        const copy = [...list];
        const cnt = Math.ceil(copy.length / size);

        const listList = [];
        for(let i = 0; i < cnt; i++) {
            listList.push(copy.splice(0, size));
        }
        
        const lastlist = listList[listList.length - 1];
        console.log(listList, lastlist)
        for(let i = lastlist.length; i < size; i++) {
            lastlist[i] = {};
        }
        return listList;
    };

    const listList = divide(timelineList, ITEM_PER_ROW);

    // 검색기능 아직 미구현 입니다ㅠㅠ 금요일까진 업데이트 하겠습니다.
    let searchWord = '';
    const filter = (e) => {
        // TODO 검색창 input에 key이벤트 발생시 검색로직 수행
        
        let filterList = [];
        $el.lastElementChild.firstElementChild.innerHTML = '';

        if( $inputSearch.value === "" ){
            divide(timelineList, ITEM_PER_ROW)
            .forEach((timelineList) => {
                gridItem($el.lastElementChild.firstElementChild, timelineList);
            });
        }else{
            for(let i = 0; i < timelineList.length; i++) {
                console.log($inputSearch.value)
                if(timelineList[i].name.includes($inputSearch.value) || timelineList[i].text.includes($inputSearch.value)){
                    filterList.push(timelineList[i])
                }
            }
            console.log("filterList", filterList)

        }

        if(filterList.length > 1){
            $el.lastElementChild.firstElementChild.innerHTML = '';
            divide( filterList, ITEM_PER_ROW).forEach(list => { gridItem($el.lastElementChild.firstElementChild, filterList ); });
        }
        $inputSearch.addEventListener('keydown', search);
    }

    // FIXME 적절한 패턴 적용하여, 보다 견고한 로직으로 리팩토링 했습니다 (수정완료)
    const comparator = (() => {
        const getTotalCount = data => data.clipCount*1 + data.commentCount*2;
        return {
            lastest: (x, y) => Date.parse(y.timestamp) - Date.parse(x.timestamp),
            popular: (x,y) => getTotalCount(y) - getTotalCount(x),
        }
    })();
    const sort = (option) => {
        // TODO 최신순/인기순 클릭시 해당 정렬로직 수행
        $el.lastElementChild.firstElementChild.innerHTML = '';
        let sortedList = timelineList.slice(); 

        sortedList.sort(comparator[option]);

        divide(sortedList, ITEM_PER_ROW)
        .forEach((sortedList) => {
            gridItem($el.lastElementChild.firstElementChild, sortedList);
        });
    }

    const render = () => {
        $parent.insertAdjacentHTML('beforeend', `
            <article class="FyNDV">
                <div class="Igw0E rBNOH YBx95 ybXk5 _4EzTm soMvl JI_ht bkEs3 DhRcB">
                    <button id="btn_latest" class="sqdOP L3NKy y3zKF JI_ht" type="button">최신순</button>
                    <button id="btn_popular" class="sqdOP L3NKy y3zKF JI_ht" type="button">인기순</button>
                    <h1 class="K3Sf1">
                        <div class="Igw0E rBNOH eGOV_ ybXk5 _4EzTm">
                            <div class="Igw0E IwRSH eGOV_ vwCYk">
                                <div class="Igw0E IwRSH eGOV_ ybXk5 _4EzTm">
                                    <div class="Igw0E IwRSH eGOV_ vwCYk">
                                        <label class="NcCcD">
                                            <input autocapitalize="none" autocomplete="off" class="input_search j_2Hd iwQA6 RO68f M5V28" placeholder="검색" spellcheck="true" type="search" value="" />
                                            <div class="DWAFP">
                                                <div class="Igw0E IwRSH eGOV_ _4EzTm">
                                                    <span aria-label="검색" class="glyphsSpriteSearch u-__7"></span>
                                                </div>
                                                <div class="Igw0E rBNOH YBx95 _4EzTm ItkAi O1flK fm1AK TxciK yiMZG"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </h1>
                    </div>
                    <div class="grid-wrap">
                        <div class="grid" style="flex-direction: column; padding-bottom: 0px; padding-top: 0px;">
                        </div>
                    </div>
            </article>
        `);
    }

    create();

    const clickLatest = function(e){
        grid.sort('latest');
    }

    const clickPopular = function(e){
        grid.sort('popular');
    }

    const search = function(e){
        grid.filter(e);
    }
    /* TODO 동일한 종류에 엘리먼트에 동일한 로직이 바인딩될 경우,
    성능튜닝을 위해 부모 엘리먼트에 이벤트를 위임하고 동일한 리스너를 붙일 수 있습니다
    이 때, data-option 과 같은 attribute를 통해 리스너 로직을 분기할 수 있습니다 */
    $btnLatest.addEventListener('click', clickLatest);
    $btnPopular.addEventListener('click', clickPopular);
    $inputSearch.addEventListener('keyup', search);

    // FIXME sort, filter는 외부에서 호출할만한 API 메소드가 아닙니다. 빼주세요.
    return { $el, listList, sort, filter }
})(timelineContent.$el.firstElementChild, timeline.url );
//grid

// grid에 리스트 render 해주는 forEach를 함수로 생성
// $parent = .grid-wrap / listList / list = row
const gridItem = ($parent, list) => {
    let $el;
    $el = $parent.lastElementChild;

    // $el = .row / list = row
    const create = () => {
        render(list);
        $el = $parent.lastElementChild;
    }

    const render = (list) => {
        /**
        * reducer는 콜백 반환값을 누적
        * arr.reduce(callback, [initialValue]) : accumulator(누산기), currentValue(현재값) -> 현재 data값을 넣은 html 누간
        */
        const html = list.reduce((html, data) => { 
            const img = (data.img || '') && `
                <a href="javascript:;">
                    <div class="eLAPa">
                        <div class="KL4Bh">
                            <img class="FFVAD" decoding="auto" src="${common.IMG_PATH}${data.img}" style="object-fit: cover;">
                        </div>
                    </div>
                </a>
            `;
            html += `
                <div class="one-item v1Nh3 kIKUG _bz0w">${img}</div>
            `;
            return html;
        }, '');
        
        $parent.insertAdjacentHTML('beforeend', `
            <div class="row Nnq7C weEfm">
                ${html}
            </div>
        `);
    }
    create();
    return { $el } //row
};

grid.listList.forEach(list => { gridItem(grid.$el.lastElementChild.firstElementChild, list); });
console.log("-----------------------")
})();
