# Makes the portfolio's English-only copy of the Creator Workbench prototype (v69).
# Source: CONTENT/80-product-development/creator-workbench/prototypes/creator-workbench-v2.html on the Mac.
# Run: python3 scripts/workbench-en.py <creator-workbench-v2.html> public/demo/workbench.html
# Then re-shoot the 8 screens (1240x870 at 1600 wide) and the 16:9 poster into public/media/creator-workbench/.
import sys,re
src,dst=sys.argv[1],sys.argv[2]
s=open(src).read()
M=[
("name:'AI 慢慢学',platform:'Xiaohongshu',lang:'中文'","name:'AI Made Easy',platform:'Xiaohongshu',lang:'Chinese'"),
("q:'AI 笔记整理'","q:'AI note organising'"),
("'高互动内容集中在“收藏了却用不上”这个痛点。表现最好的样本都先展示整理好的素材库，再给 3 步做法；只讲工具功能的内容收藏明显更低。'","'High-engagement posts cluster around one pain point: “I save everything but never use it”. The best samples open with an organised library, then give three steps. Posts that only review a tool get far fewer saves.'"),
("['12 篇里只有 3 篇给出完整操作步骤，方法层证据偏少','互动数据是 9 月 25 日采集时的快照，不代表最终表现','没有找到同一作者的前后对比数据']","['Only 3 of 12 posts give full steps, so evidence on method is thin','Engagement is a snapshot from Sep 25, not final performance','No before-and-after data from the same creator']"),
("q:'Claude Code 入门'","q:'Claude Code for beginners'"),
("{title:'收藏了 300 篇笔记，我是怎么真正用起来的',author:'小林的效率本'","{title:'I saved 300 posts. Here’s how I actually use them',author:'Lin’s Notebook'"),
("note:'开头直接展示整理后的素材库'","note:'Opens with the organised library'"),
("{title:'AI 帮我把读书笔记自动分类',author:'Mia 在读书'","{title:'AI sorts my reading notes for me',author:'Mia Reads'"),
("note:'演示为主，没有给出可复用的提示词'","note:'Mostly demo, no reusable prompt'"),
("{title:'别再只收藏了：3 步建立个人素材库',author:'阿奇做内容'","{title:'Stop just saving: build your own library in 3 steps',author:'Archie Makes Content'"),
("note:'3 步结构清晰，最后一页给了模板'","note:'Clear 3-step structure, template on the last page'"),
("{title:'Notion AI 整理笔记实测',author:'效率研究所'","{title:'Testing Notion AI for note-taking',author:'Productivity Lab'"),
("note:'偏工具评测，痛点不明确'","note:'A tool review, no clear pain point'"),
("transcript:'第 1 页：你收藏的 300 篇笔记，真正用过几篇？\\n第 2 页：第一步，按“以后要做什么”建三个文件夹，而不是按主题。\\n第 3 页：第二步，每条收藏写一句“我会在哪里用它”。\\n第 4 页：第三步，每周五花 15 分钟，把用不上的删掉。\\n第 5 页：模板在这里，直接抄。'",
 "transcript:'Page 1: You’ve saved 300 posts. How many have you used?\\nPage 2: Step 1: make three folders by what you’ll do with them, not by topic.\\nPage 3: Step 2: for every save, write one line on where you’ll use it.\\nPage 4: Step 3: spend 15 minutes every Friday deleting what you won’t use.\\nPage 5: Here’s the template. Copy it.'"),
("{id:'I-041',title:'AI 笔记：把收藏夹变成素材库',angle:'给刚开始做内容的人：3 步把收藏变成能写稿的素材'","{id:'I-041',title:'AI notes: turn your saves into a content library',angle:'For new creators: 3 steps to turn saved posts into material you can write from'"),
("{id:'I-039',title:'新手用 Claude 写周报的 3 个坑',angle:'职场新人第一次用 AI 写周报，最容易犯的 3 个错'","{id:'I-039',title:'3 mistakes beginners make writing weekly reports with Claude',angle:'The 3 most common mistakes new grads make the first time they use AI for a weekly report'"),
("'评论里有人问，但样本只有 4 条'","'People ask about it in comments, but only 4 samples'"),
("'同题材 2 条图文收藏过 2k'","'2 carousels on this topic passed 2k saves'"),
("'还没有一方实测，需要先跑一次'","'No first-hand test yet, run one first'"),
("{id:'I-036',title:'3 个让 AI 记住你文风的办法',angle:'给想让 AI 写得更像自己的人'","{id:'I-036',title:'3 ways to make AI write in your voice',angle:'For anyone who wants AI to sound more like them'"),
("'第一次用 Claude Code 前，先搞懂这 5 件事'","'5 things to know before you first use Claude Code'"),
("'用 AI 整理收藏夹的 3 步'","'3 steps to organise your saves with AI'"),
("{en:'Finished topic research “AI 笔记整理”'","{en:'Finished topic research “AI note organising”'"),
# contract & draft
("['Audience','目标人群','想用 Claude Code 但没写过代码的内容创作者'],['Situation','场景','第一次打开终端，不知道从哪开始'],['One question','唯一问题','开始之前到底要准备什么？'],['Promise','承诺与交付','看完能完成安装并跑通第一个任务；附一页准备清单'],['Primary reference','唯一主对标','S-203 · 3 步结构、最后一页给模板'],['Hook & template','Hook 与模板','结果先行 · 5 步清单模板']",
 "['Audience','目标人群','Creators who want to use Claude Code but have never coded'],['Situation','场景','Opening the terminal for the first time, not sure where to start'],['One question','唯一问题','What do I need before I start?'],['Promise','承诺与交付','Install it and finish a first task; includes a one-page checklist'],['Primary reference','唯一主对标','S-203 · 3-step structure, template on the last page'],['Hook & template','Hook 与模板','Result first · 5-step checklist']"),
("['Audience','目标人群','收藏很多但写稿时找不到参考的新手博主'],['Situation','场景','要写稿了，翻收藏夹 20 分钟没找到'],['One question','唯一问题','怎样让收藏变成写稿时能用的素材？'],['Promise','承诺与交付','3 步整理法 + 一份可复制的分类模板'],['Primary reference','唯一主对标','S-203'],['Hook & template','Hook 与模板','痛点提问 · 3 步教程模板']",
 "['Audience','目标人群','New creators who save a lot but can’t find anything when writing'],['Situation','场景','About to write, 20 minutes lost scrolling saved posts'],['One question','唯一问题','How do I turn saves into material I can use?'],['Promise','承诺与交付','A 3-step method and a copyable folder template'],['Primary reference','唯一主对标','S-203'],['Hook & template','Hook 与模板','Pain-point question · 3-step tutorial']"),
("[['p1','封面','第一次用 Claude Code 前，先搞懂这 5 件事（附准备清单）'],['p2','第 2 页','它不是聊天框。Claude Code 在你的电脑上直接读写文件，所以先准备一个专门的文件夹。'],['p3','第 3 页','先装好 Node.js，再用一行命令安装。装完输入 claude，看到欢迎界面就成功了。'],['p4','第 4 页','第一个任务别太大：让它帮你整理一个文件夹，看它怎么一步步请求你的同意。'],['p5','第 5 页','每次开工先说清楚“做完的标准”。它会按标准自己检查。'],['p6','第 6 页','准备清单：文件夹 / Node.js / 订阅账号 / 一个 15 分钟能做完的小任务。']]",
 "[['p1','Cover','5 things to know before you first use Claude Code (checklist inside)'],['p2','Page 2','It isn’t a chat box. Claude Code reads and writes files on your computer, so start with a folder just for it.'],['p3','Page 3','Install Node.js first, then install it with one command. Type claude: if you see the welcome screen, you’re in.'],['p4','Page 4','Keep the first task small: ask it to tidy a folder and watch it ask for your OK at each step.'],['p5','Page 5','Before every task, say what “done” looks like. It checks its own work against that.'],['p6','Page 6','Checklist: a folder / Node.js / a subscription / one 15-minute task.']]"),
]
for a,b in M:
    n=s.count(a)
    assert n>=1, a[:60]
    s=s.replace(a,b)
# portfolio copy: English only, so the title bar's language switch is hidden (Settings keeps the option)
a='<div class="seg" role="group" aria-label="Language"'
assert s.count(a)==1; s=s.replace(a,'<div class="seg" role="group" aria-label="Language" style="display:none"')
open(dst,'w').write(s)
