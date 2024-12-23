/** thestore */

class Store {
      constructor(file){
            this.file = file 
            this.data = null
            this.obj = {} 
      }
      async init(){
            this.obj = {
                  btn_pages: document.querySelectorAll('.btn_headline'),
                  xat_table: document.querySelector('content_body__xat'),
                  id_table_sale: document.querySelector('.content_body__sale'),
                  id_table_sold: document.querySelector('.content_body__sold'),
                  btn_pages_id: document.querySelectorAll('.page-sale'),
                  xat_table_xats: document.querySelector('.content_body__xats'),
                  xat_table_days: document.querySelector('.content_body__days'),
                  img_banner: document.querySelector('.banner_content img')
            }
            this.action()
            this.loadFile()
      }
      action() {
            /** nav pages */
            if(this.obj.btn_pages) {
                  const btns = Array.from(this.obj.btn_pages)
                  btns.forEach(btn => {
                        btn.onclick = (e) => {
                              const current = e.currentTarget
                              const element = current.dataset.page
                              for(let i = 0; i < btns.length; i++){
                                    btns[i].classList.remove('active')
                              }
                              current.classList.add('active')
                              this.showPages(element)
                        }
                  })
            }

            /** nav page id */
            if(this.obj.btn_pages_id){
                  const btns = Array.from(this.obj.btn_pages_id)
                  btns.forEach(btn => {
                        btn.onclick = (e) => {
                              for(let i = 0; i < btns.length; i++) {
                                    if(btns[i].checked) {
                                          btns[i].checked = false
                                    }
                              }
                              const current = e.currentTarget 
                              const page_value = current.value 
                              current.checked = true 
                              this.showPageId('sale', page_value)
                        }
                  })
            }
      }
      async loadFile() {
            /** load file json */
            try {
                  const response = await fetch(this.file)
                  const result = await response.json()
                  this.data = result
                  if(this.data.ids){
                        this.showPageId(result, 'm-4')
                        this.showPageId2()
                  }

                  if(this.data.xats){
                        this.showXats(result)
                        this.showDays(result)
                  }
                  this.addBanner(result.banner.url)
                 
            } catch (err) {
                  throw new Error('Failed in the load file')
            }
      }
      addBanner(url) {
            if(this.obj.img_banner){
                  this.obj.img_banner.setAttribute('src', url)
            }
      }
      showPages(element) {
            let pages = document.querySelectorAll('[data-pages=pages]')
            pages = Array.from(pages)
            for(let i = 0; i < pages.length; i++){
                  pages[i].classList.remove('show')
            }
            const page = document.querySelector(`.${element}`)
            page.classList.add('show')
      }
      showPageId(data, page) {
            const sales = this.data.ids.sale[`${page}`]
            const element = this.obj.id_table_sale
            this.buildRow('sale', element, sales)
      }
      showPageId2() {
            const solds = this.data.ids.sold
            const element = this.obj.id_table_sold
            this.buildRow('sold', element, solds)
      }
      buildRow(mode, element, obj) {
            obj = Array.from(obj)
            if(element) {
                  element.innerHTML = ''
                  let row = ''
                  obj.map((item) => {
                        row += this.render(mode, item)
                  })
                  element.innerHTML = row
            }
      }
      showXats(obj) {
            const xats = obj.xats.xat
            const element = this.obj.xat_table_xats 
            this.buildRow('xats', element, xats)
      }
      showDays(obj) {
            const days = obj.xats.day
            const element = this.obj.xat_table_days
            this.buildRow('days', element, days)
      }
      render(mode, obj) {
            switch(mode) {
                  case 'sale':
                        return `<tr>
                                    <td>${obj.id}</td>
                                    <td>${obj.price}</td>
                                    <td>${obj.digits}</td>
                                    <td>${obj.registered}</td>
                                    <td>${obj.reglink}</td>
                                    <td>${obj.seller}</td>
                               </tr>`
                  break
                  case 'sold':
                        return `<tr>
                                    <td>${obj.id}</td>
                                    <td>${obj.digits}</td>
                                    <td>${obj.date}</td>
                                    <td>${obj.seller}</td>
                               </tr>`
                  break
                  case 'xats':
                        return `<tr>
                                    <td>${obj.planos}</td>
                                    <td>${obj.price}</td>
                                    <td>${obj.xats}</td>
                               </tr>`
                  break
                  case 'days':
                        return `<tr>
                                    <td>${obj.planos}</td>
                                    <td>${obj.price}</td>
                                    <td>${obj.xats}</td>
                                    <td>${obj.days}</td>
                               </tr>`
                  break
            }
      }
}

window.onload = () => {
      const path = './assets/config/config.json'
      let store = new Store(path)
      store.init()
}