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
    return { $el }
})();

// 페이지 객체 - 요청된 URL PATH의 최상위객체, 라우팅의 주체 (팀장)
const timeline = await (async($parent) => {
    // console.log(root) //main
    // console.log(root.$el) //main
    // console.log($parent) //main
    // XXX [질문1] root, $el, root.$el 이 다 같은 엘리먼트를 가리키는데, 변수명이 다 다른 이유는 무엇때문인가요? 잘 이해가 안되서 질문드립니다.
    
    let $el;
    const url = 'https://my-json-server.typicode.com/it-crafts/lesson/timeline/';
    const infoData = await common.fetchApiData(url);
    const totalPage = infoData.totalPage * 1;
    const profileData = infoData.profile;

    const create = () => {
        render();
        $el = $parent.firstElementChild;
    }

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
        console.log("1. create")
        render();
        $el = $parent.lastElementChild;
    }

    const render = () => {
        console.log("2. render")
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

const grid = await (async ($parent, url) => {
    let $el;

    let page = 1;
    const timelineList = await common.fetchApiData(url, page++);
    console.log("3. timelineList")

    // 3번
    const create = () => {
        console.log("7. grid create")
        render();
        $el = $parent.lastElementChild;
    }

    // createGrid
    const reCreateGrid = () => {
        console.log("0. grid reCreateGrid")
        reRender();
        $el = $parent.lastElementChild.lastElementChild;
    }

    // 2번
    const divide = (list, size) => {
        console.log("5. grid divide")
        const copy = [...list];
        const cnt = Math.ceil(copy.length / size);
    
        const listList = [];
        for(let i = 0; i < cnt; i++) {
            listList.push(copy.splice(0, size));
        }

        const lastlist = listList[listList.length - 1];
        for(let i = lastlist.length; i < size; i++) {
            lastlist[i] = {};
        }
        return listList;
    };

    // 1번
    const listList = divide(timelineList, 3);
    console.log("6. grid divide listList")
    

    const filter = () => {
        // 현재는 각 컴포넌트가 destroy 미지원 -> 그냥 DOM만 비우고, 새로 gridItem들 생성
        $el.lastElementChild.firstElementChild.innerHTML = '';
        // TODO 검색창 input에 key이벤트 발생시 검색로직 수행
    }

    const sort = async (sortOption) => {
        console.log("0. grid sort")
        // 현재는 각 컴포넌트가 destroy 미지원 -> 그냥 DOM만 비우고, 새로 gridItem들 생성
        $el.lastElementChild.firstElementChild.innerHTML = '';
        let copyList = [];
        
        // TODO 최신순/인기순 클릭시 해당 정렬로직 수행
        if(sortOption.latest === true){  
            console.log('최신순')
            
            copyList = timelineList.slice(); 
            // 아래방법으로 복사하면 배열값(timestamp) 복사되지 않음
            // for(let i = 0; i < timelineList.length; i++) {
            //     copyList.push(timelineList.splice(0, timelineList.length));
            // }
            
            copyList.sort((x,y) => Date.parse(x.timestamp) - Date.parse(y.timestamp) ? 1:-1);

            for(let i = 0; i < copyList.length; i++) {
                console.log( copyList[i].timestamp, Date.parse(copyList[i].timestamp) )
            }

            /* XXX 아래처럼 new Date()를 이용한 비교식으로도 날짜비교가 가능한 것 같은데, 
            *  위에서 Date.parse()를 이용한 것과 데이터타입이 다르다는 것 말고 또 다른 차이가 있을까?
            */
            // console.log(new Date(copyList[0].timestamp) > new Date(copyList[1].timestamp) ? "앞이더큼" : "뒤가더큼")

            const listList = divide(copyList, 3);
            console.log("6. grid divide sort listList")
            reCreateGrid();

            sortOption.latest = false;
            btnLatest.removeEventListener('click', clickLatest);
        }
        return listList;
    }
    
    const render = () => {
        $parent.insertAdjacentHTML('beforeend', `
            <article class="FyNDV">
                <div class="Igw0E rBNOH YBx95 ybXk5 _4EzTm soMvl JI_ht bkEs3 DhRcB">
                    <button class="btn_latest sqdOP L3NKy y3zKF JI_ht" type="button">최신순</button>
                    <button class="btn_popular sqdOP L3NKy y3zKF JI_ht" type="button">인기순</button>
                    <h1 class="K3Sf1">
                        <div class="Igw0E rBNOH eGOV_ ybXk5 _4EzTm">
                            <div class="Igw0E IwRSH eGOV_ vwCYk">
                                <div class="Igw0E IwRSH eGOV_ ybXk5 _4EzTm">
                                    <div class="Igw0E IwRSH eGOV_ vwCYk">
                                        <label class="NcCcD">
                                            <input autocapitalize="none" autocomplete="off" class="j_2Hd iwQA6 RO68f M5V28" placeholder="검색" spellcheck="true" type="search" value="" />
                                            <div class="DWAFP">
                                                <div class="Igw0E IwRSH eGOV_ _4EzTm">
                                                    <span aria-label="검색" class="glyphsSpriteSearch u-__7"></span>
                                                </div>
                                                <span class="rwQu7">검색</span>
                                            </div>
                                            <div class="Igw0E rBNOH YBx95 _4EzTm ItkAi O1flK fm1AK TxciK yiMZG"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </h1>
                </div>
                <div>
                    <div style="flex-direction: column; padding-bottom: 0px; padding-top: 0px;">
                    </div>
                </div>
            </article>
        `);
        console.log("8. grid render")
    }

    // grid reRender
    const reRender = () => {
        $parent = $parent.lastElementChild.lastElementChild; //article
        // $parent.insertAdjacentHTML('beforeend', `
        //     <div style="flex-direction: column; padding-bottom: 0px; padding-top: 0px;">
        //     </div>
        // `);
        console.log("10. grid reRender", $parent)

        gridRender();
    }

    // 3번
    create();
    return { $el, listList, sort }
})(timelineContent.$el.firstElementChild, timeline.url );
//grid

// grid에 리스트 render 해주는 forEach를 함수로 생성
const gridRender = () => {
    grid.listList.forEach(list => {
        console.log("9. forEach")
        const gridItem = (($parent, list) => {
            let $el;

            const create = () => {
                render(list);
                $el = $parent.lastElementChild;
            }

            const render = (list) => {
                const html = list.reduce((html, data) => {
                    // 이미지(/1.jpg)가 없을 경우 undefined 대신 빈텍스트 넣는다.
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
                        <div class="v1Nh3 kIKUG _bz0w">${img}</div>
                    `;
                    return html;
                }, '');
                
                $parent.insertAdjacentHTML('beforeend', `
                    <div class="Nnq7C weEfm">
                        ${html}
                    </div>
                `);
            }
        
            create();
            return { $el }
        })(grid.$el.lastElementChild.firstElementChild, list);
    });
}
gridRender();

// XXX let과 const를 어느 상황에 써야 적절한것인지 아직 잘 감이 안옵니다ㅠ
let article = grid.$el;
const sortOption = {
    latest : false,
    popular : false
};

// 최신순 버튼 이벤트리스너
const clickLatest = await function(e){
    sortOption.latest = true;
    grid.sort(sortOption);
}
// 인기순 버튼 이벤트리스너
const clickPopular = await function(e){
    sortOption.popular = true;
    // grid.sort(sortOption);
    
}

/* XXX [질문] <main> 같은 엘리먼트나 버튼 등을 클래스(querySelector)나 아이디(getElementById)로 선택하지 않고, 컨텍스트 기반의 엘리먼트 선택 메서드를 사용하시는 이유가 있나요?
 * 성능적인 측면에서 더 우수한가요?
 */ 
// let btnLatest = article.children[0].children[1];
// let btnPopular = article.children[0].firstElementChild;
let btnLatest = article.querySelector('.btn_latest');
let btnPopular = article.querySelector('.btn_popular');

btnLatest.addEventListener('click', clickLatest);
btnPopular.addEventListener('click', clickPopular);

})();
